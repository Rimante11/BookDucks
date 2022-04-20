let profileContainer = document.querySelector("#profileContainer");
let userName = sessionStorage.getItem('username');
let userId = sessionStorage.getItem('id'); //viktig user id
let userEmail = sessionStorage.getItem("email");
let registerDate = sessionStorage.getItem("createdAt").slice(0, 10);
let userbooksText = document.querySelector("#userbookstext");
//console.log("Loggad user",userName, userId);

let regName = sessionStorage.getItem('username');
let regId = sessionStorage.getItem('regid');
let regEmail = sessionStorage.getItem('regemail'); 
let regDate = sessionStorage.getItem('regdate');
//console.log("registrerat user: ",regName, regId, regEmail, regDate);

//hämtar user info elements
let nameProfile = document.querySelector("#usernameProfile");
let idProfile = document.querySelector("#useridProfile");
let emailProfile = document.querySelector("#useremailProfile"); 
let regdateProfile = document.querySelector("#regdateProfile");

//skriver ut user info på profilsida
nameProfile.innerText += `Username ${userName}`;
idProfile.innerText += `User id: ${userId}`;
emailProfile.innerText += `Email: ${userEmail}`;
regdateProfile.innerText += `Member since: ${registerDate}`;

//get all users books
async function getAllUserBooks(){
  let books = await axios.get("http://localhost:1337/api/books?populate=*");
  let audiobooks = await axios.get("http://localhost:1337/api/audiobooks?populate=*");

  let bookList = [...books.data.data];
  let audiobookList = [...audiobooks.data.data];

  //console.log(books);

  //console.log("Books list: ", bookList);

  //för varje book
  bookList.forEach((book) => {
    //skapar variabel for user som äger booken
    let ownerOfBook = `${book.attributes.user.data.attributes.username}`;
    
    //kollar om book ägare har samma name som user som är inloggad
    if(ownerOfBook === userName){
      //ritar ut böcker som tillhör till user som är inloggad
      document.querySelector("#booksprofilesida-container").innerHTML += `
        <div class="papperBooksCon">  
          <p>Name: <strong>${book.attributes.title}</strong></p>
          <p>Author ${book.attributes.author}</p>
          <p>Genre: ${book.attributes.genre}</p>
          <p>Pages: ${book.attributes.pages} </p>
          <p>Rate: ${book.attributes.grade}/10</p>
          <img src="http://localhost:1337${book.attributes.picture.data.attributes.url}">
        </div>
      `
    }
    else{
      console.log("Not the same id");
    }
  });

  //for varje audiobook
  audiobookList.forEach((audiobook) => {
    let ownerOfAudioBook = `${audiobook.attributes.user.data.attributes.username}`;
    
    if(ownerOfAudioBook === userName){
      //ritar ut böcker som tillhör till user som är inloggad
      document.querySelector("#audiobooksprofilesida-container").innerHTML += `
      <div class="audioBooksCon">
        <p>Name:<strong> ${audiobook.attributes.title} </strong></p>
        <p>Author: ${audiobook.attributes.author}</p>
        <p>Genre: ${audiobook.attributes.genre}</p>
        <p>Release: ${audiobook.attributes.release} </p>
        <p>Legth: ${audiobook.attributes.lenght} hours</p>
        <p>Rate: ${audiobook.attributes.grade}/10</p>
          <img src="http://localhost:1337${audiobook.attributes.picture.data.attributes.url}">
      </div>  
      `
    }else{
      console.log("Not the same id audiobooks");

    }  
  });
}
getAllUserBooks();


//skapar logout function
const logOutProfile = () => {
  sessionStorage.clear(); //rensar storage
  //location.reload(); //refreshar sida
}

/*----popupen---*/
//add book popupen
document.querySelector(".addToggleBtn").addEventListener("click", function(e){
  e.preventDefault();
  document.querySelector(".bg-modal").style.display = "flex";
});

//x close button on popupen add book
document.querySelector(".close").addEventListener("click", function(){
  document.querySelector(".bg-modal").style.display = "none";
})

//add audioBook popupen
document.querySelector(".addToggleBtn2").addEventListener("click", function(){
  document.querySelector(".bg-modal2").style.display = "flex";
});

//x close button on popupen add audioboooks
document.querySelector(".close2").addEventListener("click", function(){
  document.querySelector(".bg-modal2").style.display = "none";
})


/////////////////////////////////////////////////////////////////
//-----------------JOBBA MED DET----------------------------------

//hämtar addBook inputs
//let addBookImg = document.querySelector("#bookImage").value;
let addBookButton = document.querySelector("#uploadBook");

//check user
const checkUser = async () => {
  let response = await axios.get("http://localhost:1337/api/users/me", 
  {
      headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
  })

  console.log(response.data.username);
}

//checkUser();

let addBook = async () => {

  let addTitle = document.querySelector("#booktitle");
  let addAuthor = document.querySelector("#bookauthor");
  let addPages = document.querySelector("#bookpages");
  let addGrade = document.querySelector("#bookgrade");
  let addGenre = document.querySelector("#bookgenre");

  await axios.get("http://localhost:1337/api/users/me",
  {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
  })

  let img = document.querySelector("#bookImage").files;
  let imgData = new FormData();
  imgData.append("files", img[0]);

  await axios.post("http://localhost:1337/api/upload", imgData).then((response) => {

      axios.post("http://localhost:1337/api/books", {
        data: {
          title: addTitle.value,
          author: addAuthor.value,
          pages: addPages.value,
          grade: addGrade.value,
          genre: addGenre.value,
          picture: response.data[0].id
        }
      },{
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
      })
  })
  console.log(data);
}

addBookButton.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".bg-modal").style.display = "none";
  addBook();
})