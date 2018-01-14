using System;
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
        // GET: Upload
        public ActionResult Index()
        {
            var dataFolder = Server.MapPath("~/Data");
            if (!Directory.Exists(dataFolder))
            {
                Directory.CreateDirectory(dataFolder);
            }

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
        public ActionResult Upload(HttpPostedFileBase uploadFile)
        {
            var dataFolder = Server.MapPath("~/Data");

            if (uploadFile?.ContentLength > 0)
            {
                var fileName = Path.GetFileName(uploadFile.FileName);
                var path = Path.Combine(dataFolder, fileName);

                uploadFile.SaveAs(path);
            }
            else
            {
                return Json(new { statusCode = 200, status = "failed" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { statusCode = 200, status = "success"}, JsonRequestBehavior.AllowGet);
        }
    }
}