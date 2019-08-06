const _ = require('lodash');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const jsdom = require('jsdom').JSDOM,
options = {
    resources: "usable"
};
const {getBlog, updateBlog, outDir} = require('./utils');

async function createBlog(title, {subtitle, pagetitle, folder, image} = {}) {
    if (!pagetitle) {
        pagetitle = title;
    }
    if (!folder) {
        folder = title;
    }
    folder = _.kebabCase(folder.toLowerCase());

    // Checks to make sure this directory actually exists
    // and creates it if it doesn't
    if (!fs.existsSync(`${outDir}/blog/`)){
        fs.mkdirSync(`${outDir}/blog/`, { recursive: true }, err => {});
    }
    if (!fs.existsSync(`${outDir}/blog/${folder}`)){
        fs.mkdirSync(`${outDir}/blog/${folder}`, { recursive: true });
    }

    const blogPath = `${outDir}/blog/${folder}/index.html`;

    await fs.copyFileAsync(`${__dirname}/assets/blog/blogTemplate.html`, blogPath);
    const dom = await jsdom.fromFile(blogPath, options);
    const window = dom.window;
    const document = window.document;
    const style = document.createElement("link");
    style.setAttribute("rel","stylesheet")
    style.setAttribute("href","../../index.css");
    document.getElementsByTagName("head")[0].appendChild(style);
    
    document.getElementsByTagName("title")[0].textContent = pagetitle;
    document.getElementById("blog_title").textContent = title;
    document.getElementById("blog_sub_title").textContent = subtitle;

    await fs.writeFileAsync(`${outDir}/blog/${folder}/index.html`,
        '<!DOCTYPE html>'+window.document.documentElement.outerHTML);

    const blog_data = {
        url_title: folder,
        title: title,
        sub_title: subtitle,
        top_image: image || "https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450",
        visible: true,
    };
    const old_blogs = await getBlog();
    old_blogs.push(blog_data);
    await updateBlog(old_blogs);
}

async function blogCommand(title, program) {
    /* Check if build has been executed before blog this will prevent it from giving "link : index.css" error */
    if (!fs.existsSync(`${outDir}/index.html`) || !fs.existsSync(`${outDir}/index.css`)){
        return console.error("You need to run build command before using blog one");
    }
    return createBlog(title, program);
}

module.exports = {
    blogCommand
};
