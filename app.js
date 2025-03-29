/*
 * @Author: Lieyan
 * @Date: 2025-03-30 01:16:24
 * @LastEditors: Lieyan
 * @LastEditTime: 2025-03-30 01:26:10
 * @FilePath: /FireBlog/app.js
 * @Description: 
 * @Contact: QQ: 2102177341  Website: lieyan.space  Github: @lieyan666
 * @Copyright: Copyright (c) 2025 by lieyanDevTeam, All Rights Reserved. 
 */
const express = require('express');
const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();

// 初始化数据库
const file = path.join(__dirname, 'data/db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// 初始化数据库结构
async function initDB() {
  await db.read();
  if (!db.data || typeof db.data !== 'object') {
    db.data = { posts: [] };
  }
  if (!db.data.posts) {
    db.data.posts = [];
  }
  await db.write();
}

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 解析请求体
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 基本路由
app.get('/', async (req, res) => {
  await db.read();
  const posts = db.data.posts;
  res.render('index', { posts });
});

// 创建文章路由
app.get('/posts/new', (req, res) => {
  res.render('new');
});

app.post('/posts', async (req, res) => {
  await db.read();
  const newPost = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date().toISOString()
  };
  db.data.posts.push(newPost);
  await db.write();
  res.redirect('/');
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initDB();
  console.log(`Server running on port ${PORT}`);
});
