//strapi login email: book@book.se / pass: Book1234 / Username: Book
console.log("CMS projekt");

//hämtar inputs för user login
let userName = document.querySelector("#userName");
let userPassword = document.querySelector("#userPassword");
let userLoginField = document.querySelector(".userLogIn");
//hämtar show books button & title text
let showBooksBtn = document.querySelector("#showBooksBtn");
let textElem = document.querySelector("#booksListTitle");
//hämtar register container & btn
let signInForm = document.querySelector(".registrering");
let signInBtn = document.querySelector("#sigInBtn");
//hämtar add new book container
let addBookContainer = document.querySelector("#add-book-container");
addBookContainer.style.border = "2px solid black";

//hidding show books button och add book container
showBooksBtn.style.display="none"; 
addBookContainer.style.display = "none";
textElem.style.display = "none";
signInForm.style.display = "none";


//function to hide login and show sigin form
signInBtn.addEventListener("click", ()=> {
  userLoginField.style.display =  "none";
  signInForm.style.display = "block";
})


//function to get books & audiobooks
async function getAllBooks() {
  let books = await axios.get('http://localhost:1337/api/books?populate=*');
  let audioBooks = await axios.get('http://localhost:1337/api/audiobooks?populate=*');
  console.log(books.data);
  console.log(audioBooks.data);
  //visar up texten h2
  textElem.style.display = "block";

  books.data.data.forEach(book => {
    document.querySelector("#hamtarBooks").innerHTML += `
      <p>Name: <strong>${book.attributes.title} </strong></p>
      <p>Author: ${book.attributes.author} </p>
      <p>Pages: ${book.attributes.pages} </p>
      <p>Rate: ${book.attributes.grade}/10</p>
      <img src="http://localhost:1337${book.attributes.picture.data.attributes.url}"><br>
      <button>Rent</button>

    `
    console.log(`${book.attributes.title}`); //for upp i server books name, radiera sen
  });

  audioBooks.data.data.forEach(audioBook => {
    document.querySelector("#hamtarBooks").innerHTML += `
      <p>Name:<strong> ${audioBook.attributes.title} </strong></p>
      <p>Release: ${audioBook.attributes.release} </p>
      <p>Legth: ${audioBook.attributes.lenght} hours</p>
      <p>Rate: ${audioBook.attributes.grade}/10</p>
      <img src="http://localhost:1337${audioBook.attributes.picture.data.attributes.url}"><br>
      <button>Rent</button>

    `
    console.log(`${audioBook.attributes.title}`); //for upp i server audiobooks name, radiera sen
  });

}

//getAllBooks();


//user login
let login = async () => {
  let response = await axios.post("http://localhost:1337/api/auth/local", 
  { 
    //request body
    identifier: userName.value,
    password: userPassword.value,
  });
  let token = response.data.jwt;
  sessionStorage.setItem("token", token);
  console.log(response); //får jxt utskriven
  //console.log(`${response.data.data.user}`);

  if(sessionStorage.getItem("token")){
    document.querySelector("strong").innerText = userName.value + " is loggad in!";
    //gömmer login/signiÍn fields
    userLoginField.style.display = "none";
    signInForm.style.display = "none";
    //visar upp add book block
    addBookContainer.style.display = "block";
  }
  getAllBooks(); //visar alla böcker om man är inloggat
}

//hämtar html elements for user registering
let registerUsername = document.querySelector("#userNameReg");
let registerEmail = document.querySelector("#emailReg");
let registerPassword = document.querySelector("#userPasswordReg");

//register user
let register = async () => {
  let response = await axios.post("http://localhost:1337/api/auth/local/register", 
  {
    userName: registerUsername.value,
    password: registerPassword.value,
    email: registerEmail.value
  });
  console.log(response);
  sessionStorage.setItem("token", response.data.jwt);
  getAllBooks(); //visar alla böcker efter man registrerat sig
}