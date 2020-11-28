# iseeya
A simple video conferencing app that uses [PeerJS](https://peerjs.com/) and [WebRTC](https://webrtc.org/)

## Setup STUN/SERVER server with coturn
In Ubuntu 18.04 server terminal,
```
# Update server and install coturn
sudo apt-get -y update
sudo apt-get install coturn

# Stop coturn service, because after install service auto runs
systemctl stop coturn

# Enable coturn
sudo nano /etc/default/coturn
```

In nano, set then `Ctrl+X` then `Y`,
```
TURNSERVER_ENABLED=1
```

Setup config file
```
sudo mv /etc/turnserver.conf /etc/turnserver.conf.original
sudo nano /etc/turnserver.conf
```

In nano, paste this...
```
# /etc/turnserver.conf

# STUN server port is 3478 for UDP and TCP, and 5349 for TLS.
# Allow connection on the UDP port 3478
listening-port=3478
# and 5349 for TLS (secure)
tls-listening-port=5349

# Require authentication
fingerprint
lt-cred-mech

# We will use the longterm authentication mechanism, but if
# you want to use the auth-secret mechanism, comment lt-cred-mech and 
# uncomment use-auth-secret
# Check: https://github.com/coturn/coturn/issues/180#issuecomment-364363272
#The static auth secret needs to be changed, in this tutorial
# we'll generate a token using OpenSSL
# use-auth-secret
# static-auth-secret=replace-this-secret
# ----
# If you decide to use use-auth-secret, After saving the changes, change the auth-secret using the following command:
# sed -i "s/replace-this-secret/$(openssl rand -hex 32)/" /etc/turnserver.conf
# This will replace the replace-this-secret text on the file with the generated token using openssl. 

# Specify the server name and the realm that will be used
# if is your first time configuring, just use the domain as name
server-name=domain.com
realm=domain.com

# Important: 
# Create a test user if you want
# You can remove this user after testing
user=guest:somepassword

total-quota=100
stale-nonce=600

# Path to the SSL certificate and private key. In this example we will use
# the letsencrypt generated certificate files.
cert=/usr/local/psa/var/modules/letsencrypt/etc/live/ourcodeworld.com/cert.pem
pkey=/usr/local/psa/var/modules/letsencrypt/etc/live/ourcodeworld.com/privkey.pem

# Specify the allowed OpenSSL cipher list for TLS/DTLS connections
cipher-list="ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384"

# Specify the process user and group
proc-user=turnserver
proc-group=turnserver
```
`NOTE:` 
- domain.com is your given domain an IP address can also be used
- make sure to open port `5349` and `3478` using the following...

```
sudo ufw enable 5349
sudo ufw enable 3478
```

Add A record of `turn` and `stun` in DNS manager. (turn.domain.com, stun.domain.com)

```
# Enter username and password
sudo turnadmin -a -u username -r domain.com -p password

# Turn on coturn server
sudo systemctl start coturn

# See the status of coturn
sudo systemctl status coturn
```

## Test TURN/STUN server
1. Go to [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)
2. Enter the following separately, and click `Add Server`
```
STUN or TURN URI: stun:stun.domain.com:5349


STUN or TURN URI: turn:turn.domain.com:3478?transport=tcp
TURN username: username
TURN password: password
```
3. Then click `Gather candidates`. Priority column has "Done" at the end.

## Use TURN/STUN server on PeerJS 
```
const myPeer = new Peer(undefined, {
    path: "/peerjs",
    host: localhost,
    port: 3000, // port 443 on deployment on port 3000 on localhost
    expire_timeout: 10000,
    config: {"iceServers": [
        { url: "stun:stun.domain.com:5349" },
        { url: "turn:turn.domain.com:3478?transport=tcp", username:"username", credential: "password" }
    ]}
});
```