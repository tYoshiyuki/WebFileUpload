using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebFileUpload.Models
{
    public class UploadForm
    {
        public int ID { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public byte[] FileContent { get; set; }
    }
}