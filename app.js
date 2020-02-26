feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;
let deviceArray = [];
let currentDeviceId;

const [play, pause, screenshot] = buttons;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

cameraOptions.onchange = () => {
  if(deviceId.length === 2 ){
    if(deviceId.indexOf(cameraOptions.value) === 0){
       const updatedConstraints = {
        video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
     facingMode: { 
      exact: 'user'
    }     
  },
    deviceId: {
      exact: deviceId[0]
    }
  };
  startStream(updatedConstraints);
    }
    if(deviceId.indexOf(cameraOptions.value) === 1){
        const updatedConstraints = {
     video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
     facingMode: { 
      exact: 'environment'
    }     
  },
    deviceId: {
      exact: deviceId[1]
    }
  };
  startStream(updatedConstraints);
    }
  }
  if(deviceId.length === 1) {
      const updatedConstraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value
    }
  };
  startStream(updatedConstraints);
  }
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    if(deviceArray.length === 1){
          const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
    }
    if(deviceArray.length === 2) {
      console.log('devicce array');
       const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: deviceArray[0]
      }
    };
    startStream(updatedConstraints);
    }
  }
};

const pauseStream = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

const doScreenshot = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL('image/webp');
  screenshotImage.classList.remove('d-none');
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;

const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};


const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  screenshot.classList.remove('d-none');

};


const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    deviceArray.push(videoDevice.deviceId);
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  console.log('device array' , deviceArray);
  cameraOptions.innerHTML = options.join('');
};

getCameraSelection();
