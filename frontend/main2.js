//login strapi username:Book, email:book@book.se, password:Book1234
//extra users: user1: Batman,  email: batman@batman.se, password: Batman1234
//user 2: Test, email: test@test.se, password: Test1234
console.log("Version2");
//hämtar login inputs
let loginName = document.querySelector("#identifier");
let loginPassword = document.querySelector("#password");
//hämtar html elements
let extraText = document.querySelector("#titleH");
extraText.style.display = "none";
//hämtar show books buttons container
let showBtnContainer = document.querySelector("#showButtons");
showBtnContainer.style.display = "none";
//hämtar varje button
const allBooks = document.querySelector("#allBooks");
const bookBtn = document.querySelector("#bookBtn");
const audioBookBtn = document.querySelector("#audioBookBtn");
const printBooks = document.querySelector("#paperbooks");
const printAudioBooks = document.querySelector("#audiobooks");

//hämtar logout button
let logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.style.display = "none";

//hämtar login button
let loginBtn = document.querySelector("#loginBtn");

let login = async () => {
  let response = await axios.post("http://localhost:1337/api/auth/local",
  {
    identifier: loginName.value,
    password: loginPassword.value  
  });
  console.log(response); //remove sen
  let token = response.data.jwt;
  sessionStorage.setItem("token", token);

  let id = response.data.user.id;
  let username = response.data.user.username;
  let email = response.data.user.email;
  let registerDate = response.data.user.createdAt;
  //registerDate.slice(0, 10);
  sessionStorage.setItem('id', id);
  sessionStorage.setItem('username', username);
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("createdAt", registerDate);

  loginStatus(); //gömmer login rutor
}

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  login();
})

//skapar funktion att kolla om user är inlogat eller registrerat
//döljer inlogning/register rutorna och visar böcker
let loginStatus = () => {
  if(sessionStorage.getItem("token")){
    document.querySelector("strong").innerHTML = `
    <img id="inloggningIcon" src="./images/userIcon.png" alt="User inloggad icon">
    ${loginName.value} ${registerUsername.value} is loggad in!
    `
    //visar logout btn
    logoutBtn.style.display = "block";

    //visar show buttons
    showBtnContainer.style.display = "block";
    //visar extra text checkout books
    extraText.style.display = "block";
    //gömmer login forms
    document.querySelector("#login-container").style.display = "none";
    //kör getBooks function
    getBooks();
    //getUserInfo();
  }
}

//hämtar registrerings inputs
let registerUsername = document.querySelector("#registerUsername");
let registerEmail = document.querySelector("#registerEmail");
let registerPassword = document.querySelector("#registerPassword");
let registerBtn = document.querySelector("#regBtn");
//skapar registrerings funktion
let register = async () => {
  let response = await axios.post("http://localhost:1337/api/auth/local/register",
  {
    username: registerUsername.value,
    email: registerEmail.value,
    password: registerPassword.value
  }).then(response => {
    let token = response.data.jwt
    sessionStorage.setItem("token", token);
    console.log("Registrerat", response);

    let regname = response.data.user.username;
    let regid = response.data.user.id;
    let regemail = response.data.user.email;
    let regdate = response.data.user.createdAt;
    console.log(`User registration successful!`);
    sessionStorage.setItem('username', regname);
    sessionStorage.setItem('id', regid);
    sessionStorage.setItem('email', regemail);
    sessionStorage.setItem('createdAt', regdate);
    console.log(`Registrerat as user med id: ${regid}, email ${regemail}, date ${regdate}`);
  });

  console.log(response);
  
  loginStatus();
}

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  register();
  login();
})

//skapar logout function
const logOut = () => {
  sessionStorage.clear(); //rensar storage
  location.reload(); //refreshar sida
}

//button show books
bookBtn.addEventListener("click", () => {
  printBooks.innerHTML = "";
  printAudioBooks.innerHTML = "";

  getBooks().then((data) => {
    let books = data.data;
    console.log(books);
    //för varje book skapar "utseende"
    books.forEach((book) => {
      printBooks.innerHTML += `
        <div class="papperBooksCon">
          <p><strong>${book.attributes.title} </strong></p>
          <hr>
          <p>Author: ${book.attributes.author} </p>
          <p>Genre: ${book.attributes.genre}</p>
          <p>Pages: ${book.attributes.pages} </p>
          <p>Rate: ${book.attributes.grade}/10</p>
          <p>Belongs to user: ${book.attributes.user.data.attributes.username} <br> Conatct: ${book.attributes.user.data.attributes.email} </p>
          <img src="http://localhost:1337${book.attributes.picture.data.attributes.url}" class="booksImages"><br>
          <button class="rentBtn">Rent this book</button>
        </div>  
      `
    });
  });

});

//button show audiobooks
audioBookBtn.addEventListener("click", () => {
  printBooks.innerHTML = "";
  printAudioBooks.innerHTML = "";

  getAudiobooks().then((data) => {
    let audioBooks = data.data;
    //console.log("This is audio books", audioBooks);
    audioBooks.forEach((audiobook) => {
      printAudioBooks.innerHTML += `
      <div class="audioBooksCon">
        <p><strong> ${audiobook.attributes.title} </strong></p>
        <hr>
        <p>Author: ${audiobook.attributes.author}</p>
        <p>Genre: ${audiobook.attributes.genre}</p>
        <p>Release: ${audiobook.attributes.release} </p>
        <p>Legth: ${audiobook.attributes.lenght} hours</p>
        <p>Rate: ${audiobook.attributes.grade}/10</p>
        <p>Belongs to user: ${audiobook.attributes.user.data.attributes.username} <br> Conatct:  ${audiobook.attributes.user.data.attributes.email}</p>
        <img src="http://localhost:1337${audiobook.attributes.picture.data.attributes.url}" class="booksImages"><br>
        <button class="rentBtn">Rent this book</button>
      </div>
      `
    });
  });
});


allBooks.addEventListener("click", () => {
  printBooks.innerHTML = "";
  printAudioBooks.innerHTML = "";

  getBooks().then((data) => {
    let books = data.data;
    //för varje book skapar "utseende"
    books.forEach((book) => {
      printBooks.innerHTML += `
        <div class="papperBooksCon">
          <p><strong>${book.attributes.title} </strong></p>
          <hr>
          <p>Author: ${book.attributes.author} </p>
          <p>Genre: ${book.attributes.genre}</p>
          <p>Pages: ${book.attributes.pages} </p>
          <p>Rate: ${book.attributes.grade}/10</p>
          <p>Belongs to user: ${book.attributes.user.data.attributes.username} <br> Conatct: ${book.attributes.user.data.attributes.email}</p>
          <img src="http://localhost:1337${book.attributes.picture.data.attributes.url}" class="booksImages"><br>
          <button class="rentBtn">Rent this book</button>
        </div>
      `
    });
  });

  getAudiobooks().then((data) => {
    let audioBooks = data.data;
    //console.log("This is audio books", audioBooks);
    audioBooks.forEach((audiobook) => {
      printAudioBooks.innerHTML += `
      <div class="audioBooksCon">
        <p><strong> ${audiobook.attributes.title} </strong></p>
        <hr>
        <p>Author: ${audiobook.attributes.author}</p>
        <p>Genre: ${audiobook.attributes.genre}</p>
        <p>Release: ${audiobook.attributes.release} </p>
        <p>Legth: ${audiobook.attributes.lenght} hours</p>
        <p>Rate: ${audiobook.attributes.grade}/10</p>
        <p>Belongs to user: ${audiobook.attributes.user.data.attributes.username} <br> Conatct: ${audiobook.attributes.user.data.attributes.email}</p>
        <img src="http://localhost:1337${audiobook.attributes.picture.data.attributes.url}" class="booksImages"><br>
        <button class="rentBtn">Rent this book</button>
      </div>
      `
    });
  });
})

//hämtar books from strapi
let getBooks = async () => {
  //skapar promise för axios request
  let promise = axios.get("http://localhost:1337/api/books?populate=*");
  //skapar ny promise som extracts data
  let dataPromise = promise.then((response) => response.data);
  return dataPromise;
}

//hämtar audiobooks from strapi
let getAudiobooks = async () => {
  let promise = axios.get("http://localhost:1337/api/audiobooks?populate=*");
  let dataPromise = promise.then((response) => response.data);
  return dataPromise;
}


let storage = sessionStorage.getItem("username");
console.log(storage);