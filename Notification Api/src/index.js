import "../assets/css/style.css";
// color paltte
// #FFACAC
// #FFBFA9
// #FFEBB4
// #FBFFB1
const app = document.getElementById("app");
app.innerHTML = "<h1>Notification APIs</h1>";

const init = async () => {
  const permission = await Notification.requestPermission();

  switch (permission) {
    case "granted": {
      console.log("Permission was granted!");
      break;
    }
    case "denied": {
      console.log("Permission was denied!");
      break;
    }

    default: {
      console.log("Permission was not granted nor denied");
    }
  }
  const showNotification = () => {
    const notification = notify(
      "🔊 Now Playing",
      "Mr. Brightside - The Killers"
    );

    if (notification) {
      notification.addEventListener("click", (e) => {
        window.parent.focus();
        e.target.close();
      });
    }
  };
  setTimeout(showNotification, 2000);
};

const notify = (title, body) => {
  if (Notification.permission === "granted") {
    return new Notification(title, {
      body,
      icon: "https://i.imgur.com/2Qs6HQp.png",
    });
  }
  return null;
};

if ("Notification" in window) {
  init();
} else {
  console.error("this feature is not supported by your browser");
}
