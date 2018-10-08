const DB = require('../utils/db');

module.exports = {
    add: async ctx => {
        let user = ctx.state.$wxInfo.userinfo.openId;
        let product = ctx.request.body;

        let list = await DB.query('SELECT * FROM trolley_user WHERE trolley_user.id = ? AND trolley_user.user = ?', [product.id, user]);
        
        if (!list.length) {
            await DB.query('INSERT INTO trolley_user(id, count, user) VALUES (?, ?, ?)', [product.id, 1, user]);
        } else {
            let count = list[0].count + 1;
            await DB.query('UPDATE trolley_user SET count = ? WHERE trolley_user.id = ? AND trolley_user.user = ?', [count, product.id, user]);
        }

        ctx.state.data = {};
    },
    list: async ctx => {
        let user = ctx.state.$wxInfo.userinfo.openId;
        let list = await DB.query('SELECT * FROM trolley_user LEFT JOIN product ON product.id = trolley_user.id WHERE trolley_user.user = ?', [user]);
        ctx.state.data = list;
    }
};