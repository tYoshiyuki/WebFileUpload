$(document).ready(function () {
    $('#upload-form input[name=uploadFile]').change(function (evt) { selectFile(evt); });
    $('#upload-form button[id=submit]').click(function () {
        uploadFile();
    });
});

function successHandler(data) {
    if (data.statusCode == 200) {
        alert(data.status);
        location.reload();
    } else {
        alert(data.status);
    }
}

function errorHandler(xhr, ajaxOptions, thrownError) {
    alert("There was an error attempting to upload the file. (" + thrownError + ")");
}

async function selectFile(evt) {
    var selectedFiles = evt.target.files || evt.dataTransfer.files;
    if (selectedFiles) {
        for (var i = 0; i < selectedFiles.length; i++) {
            var selectedFile = selectedFiles[i];
            if (selectedFile) {
                var FileSize = 0;
                var imageType = /image.*/;
                if (selectedFile.size > 1048576) {
                    FileSize = Math.round(selectedFile.size * 100 / 1048576) / 100 + " MB";
                }
                else if (selectedFile.size > 1024) {
                    FileSize = Math.round(selectedFile.size * 100 / 1024) / 100 + " KB";
                }
                else {
                    FileSize = selectedFile.size + " Bytes";
                }

                var row = '<div class="col-md-3">';

                if (selectedFile.type.match(imageType)) {
                    var img = await readImage(selectedFile);
                    row += '<div name="imagecontainer">' + '<img src="' + img.src + '" class="thumb" title="' + selectedFile.name + '" />' + '</div>';                    
                }

                row += '<div name="fileName" class="info">' + "Name : " + selectedFile.name + '</div>';
                row += '<div name="fileType" class="info">' + "type : " + selectedFile.type + '</div>';
                row += '<div name="fileSize" class="info">' + "Size : " + FileSize + '</div>';
                row += '</div>';
                $('#files').append(row)
            }
        }
    }

}

function readImage(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            var dataURL = reader.result;
            var img = new Image()
            img.src = dataURL;
            img.className = "thumb";
            resolve(img);
        }
        reader.readAsDataURL(file);
    });
}

function uploadFile() {
    var form = $('#upload-form')[0];
    var dataString = new FormData(form);
    $.ajax({
        url: '/Upload/Upload', 
        type: 'POST',
        success: successHandler,
        error: errorHandler,
        data: dataString,
        cache: false,
        contentType: false,
        processData: false
    });
}
