let handlefail = function(err) {
    console.log(err);
}

let remoteContainer = document.getElementById("remoteStream");
let participantBox = document.getElementById("participantList");
let userBox = document.getElementById("username");

let isAudioMuted= false;
let isVideoMuted= false;

function addVideoStream(streamId){
    // add in participant name:
    let participantName = document.createElement("span");
    participantName.innerText = streamId;
    let newLine = document.createElement("br");
    participantBox.appendChild(participantName);
    participantBox.appendChild(newLine);
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.flexDirection = "row";
    streamDiv.style.display = "inline-block";
    streamDiv.style.justifySelf = "center";
    streamDiv.style.backgroundColor = "white";
    streamDiv.style.boxShadow = "10px 0px 100px";
    streamDiv.style.width = "300px";
    streamDiv.style.height = "200px";
    streamDiv.style.transform = "rotateY(180deg)";
    remoteContainer.appendChild(streamDiv);
}

function getUsername() {
    let username = document.createElement("span");
    username.innerText = document.getElementById("username").value;
    userBox.appendChild(username);
}


document.getElementById("join").onclick = function() {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "28b5742c97a14c519416ebc8db249b7a";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail)

    client.join(
        null,
        channelName,
        Username,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function() {
                localStream.play("SelfStream")
                console.log(`App id:${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })
        }
    )

    client.on("stream-added", function (evt){
        console.log("Added Stream");
        client.subscribe(evt.stream, handlefail)
    })

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
    })

}

document.getElementById("video-mute").onclick = function(){
    if(!isVideoMuted){
        globalStream.muteVideo();
        isVideoMuted = true;
    }else{
        globalStream.unmuteVideo();
        isVideoMuted = false;
    }
}

document.getElementById("audio-mute").onclick = function(){
    if(!isAudioMuted){
        globalStream.muteAudio();
        isAudioMuted = true;
    }else{
        globalStream.unmuteAudio();
        isAudioMuted = false;
    }
}