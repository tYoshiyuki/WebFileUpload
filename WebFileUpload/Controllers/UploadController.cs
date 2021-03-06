﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebFileUpload.Models;

namespace WebFileUpload.Controllers
{
    public class UploadController : Controller
    {
        public ActionResult Index()
        {
            var dataFolder = Server.MapPath("~/Data");
            if (!Directory.Exists(dataFolder)) Directory.CreateDirectory(dataFolder);

            var dir = new DirectoryInfo(dataFolder);
            var uploads = new List<Upload>();
            dir.GetFiles().ToList().ForEach(f =>
            {
                var u = new Upload();
                u.FileName = f.Name;
                u.LastWriteTime = f.LastWriteTime;
                uploads.Add(u);
            });

            return View(uploads);
        }

        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase[] uploadFile)
        {
            var dataFolder = Server.MapPath("~/Data");

            uploadFile.ToList().ForEach(f =>
            {
                var fileName = Path.GetFileName(f.FileName);
                var path = Path.Combine(dataFolder, fileName);
                f.SaveAs(path);
            });

            return Json(new { statusCode = 200, status = "success"}, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Delete(string fileName)
        {
            var dataFolder = Server.MapPath("~/Data");
            var path = Path.Combine(dataFolder, fileName);
            System.IO.File.Delete(path);
            return Json(new { statusCode = 200, status = "success" }, JsonRequestBehavior.AllowGet);
        }

        public FileResult Download(string fileName)
        {
            var dataFolder = Server.MapPath("~/Data");
            var path = Path.Combine(dataFolder, fileName);
            return File(path, MimeMapping.GetMimeMapping(fileName), fileName);
        }

    }
}