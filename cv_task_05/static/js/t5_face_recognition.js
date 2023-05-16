let ts5DexWindow = document.querySelector('.face-detection-dex'),
    ts5OpenDexWindowBtn = document.querySelector('p.face_detection'),
    ts5DexWindowClsBtn = document.querySelector('.face-detection-dex .ts5-bar span.ts5-cls'),
    ts5OperWindow = document.querySelector(".ts5-op-window"),
    ts5OpenOperWindowBtn = document.querySelector('.ts5-try-btn'),
    ts5ClsOperWindowBtn = document.querySelector('.ts5-op-cls-btn'),
    t5WrkSpaceImg = document.querySelector('.ts5-ws-01 img'),
    t5WrkSpaceImgInp = document.querySelector('.ts5-file'),
    ts5UpldBtn = document.querySelector('.ts5-upld-btn'),
    t5ImgRemoveBtn = document.querySelector('.ts5-img-rmv-btn'),
    prcSubmitWindow = document.querySelector('.prc-str'),
    t5ResWrkSpace = document.querySelector('.ts5-ws-02'),
    unknownFaceErrorWindow = document.querySelector('.unknown-window ');

let t5Data = {};
ts5OpenDexWindowBtn.addEventListener('click', _ => {
    mainConatiner.classList.add('inactive');
    ts5DexWindow.classList.add('active');
});

ts5DexWindowClsBtn.addEventListener('click', _ => {
    mainConatiner.classList.remove('inactive');
    ts5DexWindow.classList.remove('active');
});

ts5OpenOperWindowBtn.addEventListener('click', _ => {
    ts5DexWindow.classList.remove('active');
    ts5OperWindow.classList.add('active');
});

ts5ClsOperWindowBtn.addEventListener('click', _ => {
    mainConatiner.classList.remove('inactive');
    ts5OperWindow.classList.remove('active');
});

ts5UpldBtn.addEventListener('click', _ => t5WrkSpaceImgInp.click());
t5WrkSpaceImgInp.addEventListener('input', _ => {
    ts5OperWindow.classList.contains('in-op') ? "" : ts5OperWindow.classList.add('in-op');
    t5ResWrkSpace.classList.contains('in-op') ? "" : t5ResWrkSpace.classList.add('in-op');
    let file = t5WrkSpaceImgInp.files[0];
    if (file) {
        let reader = new FileReader();
        console.log(file.name);
        reader.onload = _ => {
            let result = reader.result;
            t5WrkSpaceImg.classList.add('active');
            t5WrkSpaceImg.src = result;
            t5Data.img = result;
            t5Data.name = file.name;
            t5ImgRemoveBtn.classList.add('active');
            prcSubmitWindow.classList.add('active');
        }
        t5ImgRemoveBtn.addEventListener('click', _ => {
            t5WrkSpaceImg.classList.remove('active');
            t5ImgRemoveBtn.classList.remove('active');
            t5Data.img = ""
            t5WrkSpaceImg.src = "";
            t5WrkSpaceImgInp.value = "";
            ts5OperWindow.classList.contains('in-op') ? "" : ts5OperWindow.classList.add('in-op');
            t5ResWrkSpace.classList.contains('in-op') ? "" : t5ResWrkSpace.classList.add('in-op');
        });
        reader.readAsDataURL(file);
    }
});
prcSubmitWindow.querySelector('.prc-ts5-cls').addEventListener('click', _ => prcSubmitWindow.classList.remove('active'));
prcSubmitWindow.querySelector('.ts5-str').addEventListener('click', _ => {
    prcSubmitWindow.classList.remove('active');
    sendDataToFaceNatching(t5Data);
});

// function sendDataToFaceNatching() {
//     console.log(t5Data);
//     loader.classList.add('active');
//     fetch()
//     ts5OperWindow.classList.remove('in-op');
//     t5ResWrkSpace.classList.remove('in-op');
// }
function sendDataToFaceNatching(data) {
    console.log(data);
    loader.classList.add('active');
    fetch(`${window.origin}/face_recognition`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': "application/json",
        }),
    }).then(response => {
        if (response.status !== 200) {
            console.log(`Response status was not 200: ${response.status}`);
            errorWindow.classList.add('active');
            loader.classList.remove('active');
            return;
        }
        response.json().then(data => {
            console.log(data['Message']);
            console.log(data['img']);
            console.log(data['stat']);
            console.log(data['prs_name']);
            if (data['stat'] == "Unknown face") {
                unknownFaceErrorWindow.classList.add('active');
            } else {
                t5ResWrkSpace.querySelector('img').src = data['img'];
                t5ResWrkSpace.querySelector('img').classList.add('active');
                ts5OperWindow.classList.remove('in-op');
                t5ResWrkSpace.classList.remove('in-op');
            }
            loader.classList.remove('active');
        });
    });
}

unknownFaceErrorWindow.querySelector('.unf-cls').addEventListener('click', _ => unknownFaceErrorWindow.classList.remove('active'));