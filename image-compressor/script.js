var upload = document.querySelector('.upload')
var download = document.querySelector('.download')
var hiddenButton = document.querySelector('#hidden-button')
var input = document.querySelector('#slider-input')
var inputValue = document.querySelector('.input-value')
var inputMetedata = document.getElementsByClassName('metadata')[0]
var outputMetedata = document.getElementsByClassName('metadata')[1]

input.oninput = function(){
    var c = document.getElementsByClassName('top')[0]
    c.style.width = (600/100)*input.value + 'px'
}

upload.onclick = function(){
    // click on input type file
    hiddenButton.click();
}

hiddenButton.onchange = () => {
    // get selected file
    var file = hiddenButton.files[0];
    var url = URL.createObjectURL(file);
    var img = document.createElement('img');
    // load image to get width height
    img.src = url;
    img.onload = function(){
        var w = img.width;
        var h = img.height;
        // give metedata of input file
        inputMetedata.getElementsByTagName('li')[0].getElementsByTagName('span')[0].innerHTML = file.name;
        inputMetedata.getElementsByTagName('li')[1].getElementsByTagName('span')[0].innerHTML = w + '/' + h;
        inputMetedata.getElementsByTagName('li')[2].getElementsByTagName('span')[0].innerHTML = ((file.size/1024)/1024).toFixed(2) + 'Mb';
        // set attribute for file name used in downloading
        upload.setAttribute('filename', file.name);
        // create a function to get ratio of width height
        calculateValues(inputValue.value, w, h);
        inputValue.onchange = function(){
            // run function again on changing compressed ratio
            calculateValues(inputValue.value, w, h);
        }
        // set original image on preview
        document.querySelector('.bottom img').src = url;
    }
}

// now create calculateValues function here
function calculateValues(v, w, h){
    var outputQuality = ((100-v) / 100);
    var outputWidth = w * outputQuality;
    var outputHeight = h * outputQuality;
    // now craete a function to compress
    Compress(outputQuality, outputWidth, outputHeight);
}

function Compress(q, w, h){
    new Compressor(hiddenButton.files[0], {
        quality: q,
        width: w,
        height: h,
        success(result){
            var url = URL.createObjectURL(result);
            document.getElementsByClassName('output')[0].style.display = 'block';
            document.getElementsByClassName('progress')[0].style.display = 'block';
            document.getElementsByClassName('preview-container')[0].style.display = 'block';
            var img = document.createElement('img');
            img.src = url;
            img.onload = function(){
                // show compressed image on preview
                document.querySelector('.top img').src = url;
                var w = img.width;
                var h = img.height;
                // give metedata of output file
                outputMetedata.getElementsByTagName('li')[0].getElementsByTagName('span')[0].innerHTML = ((((q*100)-99))+((q*100)/100)*10).toFixed(0) + '%';
                outputMetedata.getElementsByTagName('li')[1].getElementsByTagName('span')[0].innerHTML = w + '/' + h;
                outputMetedata.getElementsByTagName('li')[2].getElementsByTagName('span')[0].innerHTML = (result.size/1024).toFixed(0) + 'Kb';
            }
            download.onclick = function(){
                var filename = upload.getAttribute('filename').split('.');
                var a = document.createElement('a');
                a.href = url;
                a.download = filename[0] + '-min.' + filename[1];
                a.click();
            }
        },
        error(err){
            console.log(err.message);
        }
    })
}



/* resim düzenletici css*/




const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());