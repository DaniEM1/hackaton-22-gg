"use strict";

// const bodyEl = document.body;
const result = document.getElementById("result");
const btnElValidator = document.getElementById("btn-file");
const inputValidator = document.getElementById("real-file");
const instructionsCont = document.querySelector(".instructions-container");
const barCont = document.querySelector(".progress-bar-container");
const checklistCont = document.querySelector(".checklist-container");
const btnStartOver = document.querySelector('#btn-start-over');
const btnContinue = document.querySelector('#btn-continue');
const btnCancel = document.querySelector('.cancel-button');
const btnSubmit = document.querySelector('.btn-submit')
const btnCreate = document.querySelector('.btn-create')
const formContainer = document.querySelector('.form-container');
const formNameUnit = document.querySelector('.form-name-unit');
const checklistList = document.querySelector('.checklist-list');
const previewLinkCont = document.querySelector('.preview-link-container');
const demoLink = document.querySelector('.demo-link')
let iframe = document.createElement('iframe');
let iFrameEl;
let iFrameUnitName;


btnElValidator.addEventListener("click", ()=>{
    inputValidator.click();
})

document.getElementById("real-file").addEventListener("change", function(evt) {
    
    console.log("File Name:", evt.target.files[0].name);
    formNameUnit.innerHTML = evt.target.files[0].name;
    checklistList.innerHTML = "";

    document.body.appendChild(iframe);
    iframe.setAttribute("id", "creativeFrame")
    // iframe.src = "./utils/creative.html";
    iFrameEl = document.getElementById("creativeFrame");
    let iFrameDocument;
    setTimeout(() => {        
        iFrameDocument = iFrameEl.contentDocument;
    }, 10);
    let scriptHead = document.createElement('script');
    let scriptBody = document.createElement('script');


    const fileSizeHandler = (fileSizeMb, maxSize) => {

        const sizeOkHtml = `
            <li class="flex"><i class="fa fa-check flex"></i>File Size OK</li>
        `

        const sizeExceededHtml = `
            <li class="flex gds-tooltip gds-tooltip--bottom" data-tooltip="Read about files size page"><i class="fa fa-times flex "></i><a href="https://app.getguru.com/boards/Ec99Rq8c/Design/?activeCard=df3057e4-e079-4b66-8f99-cd2eb983973a&boardSectionId=a788a76e-82d1-417c-bd7e-91945660e1fd" target="_blanks">File Size Exceeded</a></li>            
        `

        // fileSizeMb > maxSize ? console.warn("File size exceeded") : console.log("File Size ok");
        fileSizeMb > maxSize 
                ? checklistList.innerHTML = checklistList.innerHTML + sizeExceededHtml 
                : checklistList.innerHTML = checklistList.innerHTML + sizeOkHtml;

    }



    const bannerLocationHandler = () =>{
        const imageOuterHtmlWarning = `
            <li class="flex"><i class="fa fa-exclamation flex"></i>Double Check your outer images/elements are clickable</li>
            <li class="flex"><i class="fa fa-check flex"></i>Loop animations are not infinite</li>
            <li class="flex"><i class="fa fa-check flex"></i>Animations are not longer than 30 seconds</li>
            <li class="flex"><i class="fa fa-check flex"></i>Tile is clickable</li>
        `
        
        const imageOuterHtmlOk = `
            <li class="flex"><i class="fa fa-check flex"></i>Outer images/elements are clickable</li>
            <li class="flex"><i class="fa fa-check flex"></i>Loop animations are not infinite</li>
            <li class="flex"><i class="fa fa-check flex"></i>Animations are not longer than 30 seconds</li>
            <li class="flex"><i class="fa fa-check flex"></i>Tile is clickable</li>
        `


        setTimeout(() => {
            const bannerEl = iFrameDocument.getElementById("click-banner");
            // console.log(bannerEl.getBoundingClientRect()); 
            let bannerCoords = bannerEl.getBoundingClientRect();
            let bannerCoordsTop = bannerCoords.top;
            let bannerCoordsLeft = bannerCoords.left;
            let bannerCoordsRight = bannerCoords.right;
            const bannerImgs = iFrameDocument.querySelectorAll('[role="img"]');
            let flagImg = false;
            // console.log( bannerImgs);
            // for(const img of bannerImgs) {
            for(let i = 0; i < bannerImgs.length; i++) {
                // console.log(img.getBoundingClientRect().top);
                if(bannerImgs[i].getBoundingClientRect().top < bannerCoordsTop){
                    // console.log("image outter detected")
                    checklistList.innerHTML = checklistList.innerHTML + imageOuterHtmlWarning; 
                    flagImg = true;
                    break;
                }
                if(bannerImgs[i].getBoundingClientRect().left < bannerCoordsLeft){
                    // console.log("image outter detected")
                    checklistList.innerHTML = checklistList.innerHTML + imageOuterHtmlWarning;  
                    flagImg = true;
                    break;
                }
                if(bannerImgs[i].getBoundingClientRect().right > bannerCoordsRight){
                    // console.log("image outter detected")
                    checklistList.innerHTML = checklistList.innerHTML + imageOuterHtmlWarning;  
                    flagImg = true;
                    break;
                } 
                
                
            };
            // console.log(flagImg)
            if(!flagImg){
                checklistList.innerHTML = checklistList.innerHTML + imageOuterHtmlOk;
            }

        }, 500);
    }


    function handleFile(f) {
        let fileName = f.name;
        let unitType = fileName.match(/(isxv|is)/);
        iframe.src = `./utils/creative-${unitType[0]}.html`;
        let firstJsFile;
        let secondJsFile;
        console.log("Unit type:", unitType[0]);
       
        let fileSizeMb = f.size/1000000;
        console.log("File Size", fileSizeMb)

        switch (unitType[0]) {
            case "isxv":
                fileSizeHandler( fileSizeMb, 3.5 );   
                firstJsFile = 'isxv.hyperesources/HYPE-740.full.min.js';
                secondJsFile = 'isxv.hyperesources/isxv_hype_generated_script.js';
                demoLink.href= "https://c.ggops.com/adbuilder/demos/48821/1660694808591_ad.html";
                break;
            
            case "is":
                fileSizeHandler(fileSizeMb, 0.5);   
                firstJsFile = 'is.hyperesources/HYPE-740.thin.min.js';
                secondJsFile = 'is.hyperesources/is_hype_generated_script.js' ;
                demoLink.href= "https://c.ggops.com/adbuilder/demos/48111/1660683665742_ad.html";
            break;
                

            default:
                console.log("couldnt handle switch")
                break;
        }



        JSZip.loadAsync(f)                                   
            .then(function(zip) {

                // zip.forEach(function (relativePath, zipEntry) {  
                //     // console.log(zipEntry.name);
                // });

                return zip.file(firstJsFile).async("string")

            })
            .then(function success(zipText) {                    //display the result
                // console.log(zipText)
                // console.log(text.search("data-outter-el"));
                // console.log(text.search("click-banner"));

                
                scriptHead.text = zipText;
                iFrameDocument.head.appendChild(scriptHead);                    


            }
            , function (e) {
                // result.append(("<div>", {
                //     "class" : "alert alert-danger",
                //     text : "Error reading " + f.name + ": " + e.message
                // }));
                throw new Error;
            });

        JSZip.loadAsync(f)                                   
            .then(function(zip) {

                // zip.forEach(function (relativePath, zipEntry) {  
                //     // console.log(zipEntry.name);
                // });

                return zip.file(secondJsFile).async("string")

            })
            .then(function success(zipText) {   
                // console.log(zipText)
                                 //display the result
                // ================ Video Class Handler Funciton ====================
                if(unitType[0] === "isxv"){
                    console.log("handle video class")
                    const videoClassHandler = () => {
                        const video300El = zipText.search("gg_video_300");
                        const video600El = zipText.search("gg_video_600");
    
                        if ( (video300El > 0) && (video600El > 0) ) return true;
                    }

                    const videoOkHtml = `
                        <li class="flex"><i class="fa fa-check flex"></i>gg_video_300 & gg_video_600 classes are OK</li>
                        <li class="flex"><i class="fa fa-check flex"></i>Video is muted</li>
                    `
                    const videoMissingHtml = `
                        <li class="flex gds-tooltip gds-tooltip--bottom" data-tooltip="Read about gg_video_classes""><i class="fa fa-times flex"></i><a href="https://app.getguru.com/boards/Ec99Rq8c/Design/?activeCard=05773ca1-57ec-47b7-9e80-0e6f1dfcaad1&boardSectionId=a788a76e-82d1-417c-bd7e-91945660e1fd" target="_blank">gg_video_3000 & gg_video_600 classes are missing</a></li>
                        <li class="flex"><i class="fa fa-times flex"></i>Video is NOT muted</li>

                    `
                    
                    videoClassHandler() 
                        ? checklistList.innerHTML = checklistList.innerHTML + videoOkHtml
                        : checklistList.innerHTML = checklistList.innerHTML + videoMissingHtml;
                }
                // ================ Video Class Handler Function ENDS ====================

                scriptBody.text = zipText;
                iFrameDocument.body.appendChild(scriptBody);
                
                
                
            }
            , function (e) {
                // result.append(("<div>", {
                    //     "class" : "alert alert-danger",
                    //     text : "Error reading " + f.name + ": " + e.message
                    // }));
                    throw new Error;
                });
           
        
                // unitType[0] === "is" && bannerLocationHandler();
                bannerLocationHandler();
    }

    const hideInstructions = ()=>{
        instructionsCont.classList.add("d-none");
        barCont.classList.replace("d-none", "d-block")
    }    

    let i = 0;
    (function moveProgressBar() {
        hideInstructions();
        if (i == 0) {
            i = 1;
            var elem = document.getElementById("myBar");
            var width = 1;
            var id = setInterval(frame, 10);
            function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
                setTimeout(() => {
                    
                    const warningEl = document.querySelector(".fa.fa-times");
                    if(warningEl !== null){
                        btnContinue.classList.add("d-none")
                    }
                    else{
                        btnStartOver.classList.add("d-none")
                    }
                    // console.log(warningEl)
                    barCont.classList.replace("d-block","d-none");
                    checklistCont.classList.replace("d-none","d-block");
                }, 100);


            } else {
                width++;
                elem.style.width = width + "%";
            }
            }
        }
        
    })();
    

    let files = evt.target.files;
    for (let i = 0; i < files.length; i++) {
        handleFile(files[i]);
    }

});


btnStartOver.addEventListener("click",()=>{
    checklistCont.classList.replace("d-block","d-none");
    instructionsCont.classList.replace("d-none","d-block");
    btnStartOver.classList.replace("d-none","d-block");
    btnContinue.classList.replace("d-none","d-block");
})

btnContinue.addEventListener("click",()=>{
    checklistCont.classList.replace("d-block","d-none");
    formContainer.classList.replace("d-none","d-block");
})

btnCancel.addEventListener("click", ()=>{
    checklistCont.classList.replace("d-block","d-none");
    instructionsCont.classList.replace("d-none","d-block");
    formContainer.classList.replace("d-block", "d-none");
    btnStartOver.classList.replace("d-none","d-block");
    btnContinue.classList.replace("d-none","d-block");
})

btnSubmit.addEventListener("click",() =>{
    formContainer.classList.replace("d-block", "d-none")
    previewLinkCont.classList.replace("d-none", "d-block")
})

btnCreate.addEventListener("click", ()=>{
    instructionsCont.classList.replace("d-none","d-block");
    previewLinkCont.classList.replace("d-block", "d-none");
    btnStartOver.classList.replace("d-none","d-block");
    btnContinue.classList.replace("d-none","d-block");
})






