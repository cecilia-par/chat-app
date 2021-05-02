const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
let app = express();
var server = require("http").createServer(app);
global.io = require("socket.io")(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const secretKey =
  "HGafH3fZylEEo6RbnrNyOMrEd7jqR6n6y7YaFM931mLnaINHUadSi6HROBYmdpX";

let messages = [];
let Users = [];
const port = process.env.PORT || 3000;

global.io
  .use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.authorization) {
      jwt.verify(
        socket.handshake.query.authorization,
        secretKey,
        function (err, decoded) {
          if (err) return next(new Error("Authentication error"));
          socket.decoded = decoded;
          next();
        }
      );
    } else {
      next(new Error("Authentication error"));
    }
  })
  .on("connection", function (socket) {
    console.log("connected socket ID : " + socket.id);

    socket.on("disconnect", function (token) {
      socket.emit("disconnected");
    });
  });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/login", function (req, res) {
  var theUser = Users.find((u) => u.id === req.body.id);
  if (!theUser) {
    const token = jwt.sign({ userId: req.body.id }, secretKey, {
      expiresIn: "24h",
    });
    if (token) {
      if (req.body.token) theUser.token = "";
      req.body.token = token;
    }
    Users.push(req.body);
    theUser = req.body;
    return res.status(200).json({
      success: true,
      authorization: token,
      user: req.body,
    });
  }
  return res.status(404).json({
    success: false,
    message: "Wrong password or username",
  });
});

app.post("/logout", authenticateToken, function (req, res) {
  var userIndex = Users.findIndex((u) => u.id === req.user.userId);
  if (userIndex !== -1) {
    Users.splice(userIndex, 1);
  }
  return res.status(200).json({
    success: true,
  });
});

app.get("/message", authenticateToken, function (req, res) {
  return res.status(200).json({
    success: true,
    authorization: req.authToken,
    messages: messages,
  });
});

app.get("/user", authenticateToken, function (req, res) {
  var user = Users.find((u) => u.id === req.user.userId);
  if (user) {
    return res.status(200).json({
      success: true,
      authorization: req.authToken,
      user: user,
    });
  }
});

app.post("/message", authenticateToken, function (req, res) {
  if (messages.findIndex((m) => m.message == req.body.message) == -1) {
    messages.push(req.body);
    var message = req.body;
    global.io.sockets.emit("message", { message });
    return res.status(200).json({
      success: true,
      authorization: req.authToken,
      message: message,
    });
  }
});

/** catch 404 and forward to error handler */
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});

//Authentification Test Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
