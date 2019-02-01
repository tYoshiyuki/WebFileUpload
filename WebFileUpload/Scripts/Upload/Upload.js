$(document).ready(function () {
    $('#upload-form input[name=uploadFile]').change(evt => selectFile(evt) );
    $('#upload-form button[id=submit]').click(() => uploadFile() );

    var filedropArea = document.getElementById('filedrop-area');
    filedropArea.addEventListener('dragover', evt => {
        evt.preventDefault();
        evt.dataTransfer.effectAllowed = 'copy';
        evt.dataTransfer.dropEffect = 'copy';
    }, false);
    filedropArea.addEventListener('drop', selectFile, false);
    filedropArea.addEventListener('dragenter', () => $('#filedrop-area').addClass('filedrop-area-hover'), false);
    filedropArea.addEventListener('dragleave', () => $('#filedrop-area').removeClass('filedrop-area-hover'), false);

    $(':button.download-button').click((evt) => {
        var data = { fileName: evt.currentTarget.value };
        $.ajax({
            url: '/Upload/Download',
            type: 'POST',
            error: (xhr, ajaxOptions, thrownError) => alert("There was an error attempting to download the file. (" + thrownError + ")"),
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false
        });

    });

    $(':button.delete-button').click((evt) => {
        var data = { fileName: evt.currentTarget.value };
        $.ajax({
            url: '/Upload/Delete',
            type: 'POST',
            success: data => {
                alert(data.status);
                if (data.statusCode === 200) location.reload();
            },
            error: (xhr, ajaxOptions, thrownError) => alert("There was an error attempting to delete the file. (" + thrownError + ")"),
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    });

});

var selectedFiles;
async function selectFile(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $('#filedrop-area').removeClass('filedrop-area-hover');

    selectedFiles = evt.target.files || evt.dataTransfer.files;
    if (selectedFiles) {
        $('#files').empty();
        for (var i = 0; i < selectedFiles.length; i++) {
            var selectedFile = selectedFiles[i];
            if (selectedFile) {
                var fileSize = 0;
                var imageType = /image.*/;
                if (selectedFile.size > 1048576) {
                    fileSize = Math.round(selectedFile.size * 100 / 1048576) / 100 + " MB";
                } else if (selectedFile.size > 1024) {
                    fileSize = Math.round(selectedFile.size * 100 / 1024) / 100 + " KB";
                } else {
                    fileSize = selectedFile.size + " Bytes";
                }

                var row = '<div class="col-md-3 file-content">';

                if (selectedFile.type.match(imageType)) {
                    var img = await readImage(selectedFile);
                    row += '<div name="imagecontainer">' + '<img src="' + img.src + '" class="thumb" title="' + selectedFile.name + '" />' + '</div>';                    
                }

                row += '<div name="fileName" class="info">' + "Name : " + selectedFile.name + '</div>';
                row += '<div name="fileType" class="info">' + "type : " + selectedFile.type + '</div>';
                row += '<div name="fileSize" class="info">' + "Size : " + fileSize + '</div>';
                row += '</div>';
                $('#files').append(row);
            }
        }
    }

}

function readImage(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = e => {
            var dataURL = reader.result;
            var img = new Image();
            img.src = dataURL;
            img.className = "thumb";
            resolve(img);
        };
        reader.readAsDataURL(file);
    });
}

function uploadFile() {
    var dataString = new FormData();
    for (var i = 0; i < selectedFiles.length; i++) {
        dataString.append("uploadFile", selectedFiles[i]);
    }

    $.ajax({
        url: '/Upload/Upload', 
        type: 'POST',
        success: data => {
            alert(data.status);
            if (data.statusCode === 200) location.reload();
        },
        error: (xhr, ajaxOptions, thrownError) => alert("There was an error attempting to upload the file. (" + thrownError + ")"),
        data: dataString,
        cache: false,
        contentType: false,
        processData: false
    });
}
