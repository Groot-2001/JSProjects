import "../assets/css/style.css";

//getting the reference of the app using dom
const app = document.getElementById("app");

//adding some content in it.
app.innerHTML = `
    <h1>File Uploader</h1>
    <div class="uploader">
        <h2> Upload a File 📰</h2>
        <p>Accepts only png, jpeg, svg</p>
        <input type="file" class="files" accept="image/*" multiple>
        <div class="dropZone">📁 Drag to Upload</div>
        <div class="imgPreview"></div>
    </div>

    <style>
        .uploader{
            font-family:"Arial";
            color:white;
            font-size:1.5em;
            box-sizing:border-box;
            background:#9DB2BF;
            max-width:60%;
            margin:25px auto;
            padding:25px;
            border-bottom:3px solid #d2d5da;
            border-radius:10px;
        }
        .dragme{
            background:red;
            border-radius:10px;
            width:50px;
            height:50px;
        }
        .dropZone{
            color: #0E2954;
            font-weight:bold;
            background: #ededed;
            border:0.2em dashed #808080;
            padding:25px;
            margin:25px auto;
        }
        .imgPreview{
          display:flex;
          flex-direction:column;
          flex-wrap:wrap;
          justify-content:center;
          align-items:center;
          background:#DDE6ED;
          border-radius:1em;
        }
        .preview{
          color:black;
          display:flex;
          justify-content:center;
          align-items:center;
          background:white;
          margin:0.5em;
          border-radius:1em;
        }
        .active{
            background: #e6ffe6;
            border-color: #009900;
        }
    </style>
`;

//initialize the draggable events
const init = () => {
  //getting the reference where we want to add draggable feature.
  const dropZone = document.querySelector(".dropZone");
  const previewSpace = document.querySelector(".imgPreview");
  const files = document.querySelector(".files");
  //dragenter Event
  dropZone.addEventListener("dragenter", (e) =>
    e.target.classList.add("active")
  );
  //dragleave Event
  dropZone.addEventListener("dragleave", (e) =>
    e.target.classList.remove("active")
  );
  //dragover Event
  dropZone.addEventListener("dragover", (e) => {
    //preventDefault prevents the page by loading
    e.preventDefault();
    e.dataTransfer.dropEffect = "copyLink";
  });
  //drop Event
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("active");
    const { files } = e.dataTransfer;
    handleFileUpload(files);
  });

  files.addEventListener("change", (e) => {
    const { files } = e.target;
    handleFileUpload(files);
  });
  const showPreview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (e) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="preview" style="padding:1em;" >
          <img 
            src="${e.target.result}"
            alt="Image is broken"
            style="width:5em; margin-right:10px;"
          >
          <p>${file.name} <span>${Math.trunc(
        (file.size / 1048576) * 1000
      )}kb.</span></p>
        </div>
      `;
      previewSpace.append(div);
    });
  };

  const uploadFiles = async (files) => {
    const form = new FormData();
    [...files].forEach((file) => {
      form.append(file.name, file);
    });
    //https://glitch.com/edit/#!/dragdropfiles
    const request = await fetch("//dragdropfiles.glitch.me/upload", {
      method: "POST",
      body: form,
    });

    return await request.json();
  };

  const isAllowedType = (file) => {
    return ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type);
  };

  const handleFileUpload = async (files) => {
    const filesToUpload = [...files].filter(isAllowedType);
    filesToUpload.forEach(showPreview);

    const data = await uploadFiles(filesToUpload);

    if (data) {
      for (let img of data.images) {
        console.dir(img);
      }
    }
  };

  document.addEventListener("dragover", (e) => e.preventDefault());
  document.addEventListener("drop", (e) => e.preventDefault());
};

//checking whether the browser has the draggable feature.
if ("draggable" in document.createElement("div")) {
  init();
} else {
  app.innerHTML = `<h3>Sorry , your browser doesn't support draggable feature</h3>`;
}
