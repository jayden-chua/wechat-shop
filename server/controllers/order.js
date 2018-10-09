const DB = require('../utils/db');

module.exports = {
    add: async ctx => {
        let user = ctx.state.$wxInfo.userinfo.openId;
        let productList = ctx.request.body.list || [];
        let isInstantBuy = !!ctx.request.body.isInstantBuy;

        let order = await DB.query('INSERT INTO order_user(user) VALUES (?)', [user]);

        let orderId = order.insertId;

        let insertSql = 'INSERT INTO order_product(order_id, product_id, count) VALUES ';
        let param = [];
        let query = [];
        let removeIdQueue = [];
        let removeQueryQueue = [];

        productList.forEach(product => {
            query.push('(?, ?, ?)');
            param.push(orderId);
            param.push(product.id);
            param.push(product.count || 1);

            if (!isInstantBuy) {
                removeIdQueue.push(product.id);
                removeQueryQueue.push('?');
            }
        });

        if (!isInstantBuy) {
            await DB.query('DELETE FROM trolley_user WHERE trolley_user.id IN (' + removeQueryQueue.join(', ') + ') AND trolley_user.user = ?', [...removeIdQueue, user])
        }

        await DB.query(insertSql + query.join(', '), param);
    },
    list: async ctx => {
        let user = ctx.state.$wxInfo.userinfo.openId;
        let sql = 'SELECT order_user.id AS `id`, ';
        sql += 'order_user.user AS `user`, ';
        sql += 'order_user.create_time AS `create_time`, ';
        sql += 'order_product.product_id AS `product_id`, ';
        sql += 'order_product.count AS `count`, ';
        sql += 'product.name AS `name`, ';
        sql += 'product.image AS `image`, ';
        sql += 'product.price AS `price` ';
        sql += 'FROM order_user ';
        sql += 'LEFT JOIN order_product ON order_user.id = order_product.order_id ';
        sql += 'LEFT JOIN product ON order_product.product_id = product.id ';
        sql += 'WHERE order_user.user = ? ';
        sql += 'ORDER BY order_product.order_id;';

        let list = await DB.query(sql, [user]);
        let ret = [];
        let cacheMap = [];
        let block = [];
        let id = 0;

        list.forEach((order) => {
            if (!cacheMap[order.id]) {
                block = [];
                ret.push({
                    id: ++id,
                    list: block
                });

                cacheMap[order.id] = true;
            }
            block.push(order);
        });
        ctx.state.data = ret;
    }
}