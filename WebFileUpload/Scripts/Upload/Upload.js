$(document).ready(function () {
    $('#formUpload input[name=uploadFile]').change(function (evt) { selectFile(evt); });
    $('#formUpload button[id=submit]').click(function () {
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

function selectFile(evt) {
    var selectedFile = ($("#uploadFile"))[0].files[0];
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

        if (selectedFile.type.match(imageType)) {
            $("#imagecontainer").empty();
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataURL = reader.result;
                var img = new Image()
                img.src = dataURL;
                img.className = "thumb";
                $("#imagecontainer").append(img);
            }
            reader.readAsDataURL(selectedFile);
        }
        $("#fileName").text("Name : " + selectedFile.name);
        $("#fileType").text("type : " + selectedFile.type);
        $("#fileSize").text("Size : " + FileSize);
    }
}

function uploadFile() {
    var form = $('#formUpload')[0];
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
