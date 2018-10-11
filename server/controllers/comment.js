const DB = require('../utils/db');

module.exports = {
    add: async ctx => {
        let user = ctx.state.$wxInfo.userinfo.openId;
        let username = ctx.state.$wxInfo.userinfo.nickName;
        let avatar = ctx.state.$wxInfo.userinfo.avatarUrl;

        let productId = +ctx.request.body.productId;
        let content = ctx.request.body.content || null;

        let images = ctx.request.body.images || [];
        images = images.join(";;");

        if (!isNaN(productId)) {
            await DB.query('INSERT INTO comment(user, username, avatar, content, product_id, images) VALUES (?, ?, ?, ?, ?, ?);', [user, username, avatar, content, productId, images]); // fix unicode problem?
        }

        ctx.state.data = {};
    },
    list: async ctx => {
        let productId = +ctx.request.query.productId;

        if (!isNaN(productId)) {
            ctx.state.data = await DB.query('SELECT * FROM comment WHERE comment.product_id =? ;',  [productId]);
        } else {
            ctx.state.data = [];
        }
    }
}