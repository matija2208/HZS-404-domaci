async function putData(post)
{
    const cardsDiv = document.querySelector(".pozadina");
    var txt="";
    post.potrebniSastojci.forEach(i => txt+="- "+i.kolicinaSastojka+" "+i.imeSastojka+"<br>");

    var idKorisnika = localStorage.getItem("id");
    var srce = "far fa-heart";
    post.lajkovi.forEach(i=>{
        if(i === idKorisnika){
            srce = "fas fa-heart";
        }
    });

    var src=`
        <div class="prostor">
            <div class="slika"><img id="slika" src="${post.slika}"></div>
        </div> 
        <div class="linija"></div>
        <div class="sastojci">
        <h1 class = "opisBitnoTop">${post.imeJela}</h1>
        <h2 id="user-name">Autor recepta: ${await GetUserData(post.idKorisnika)}</h2>
        <h1 class="opisBitnoTop">VREME PRIPREME: ${post.vremeSpremanja} minuta</h1><br>
        <h1 class="opisBitno">POTREBNI SASTOJCI:</h1><br>
        <p class="opisBitno">
            ${txt}
        </p>
        </li><br>
        <h1 class="opisBitno"><b>NAČIN PRIPREME:</b></h1>
        <p class="opisBitno">
            ${post.recept}
        </p>
        <span id="srce" onclick="updateLike('${location.search.substring(1)}')"><i class="${srce}"></i> ${post.brojLajkova}</span>
        <button class="print-button" onClick = window.print();>Print</button>
        <button name="hidden_buttons" class="delete-button hidden" id="button1" onclick = "GoToUpdate('${location.search.substring(1)}')">Update</button>
        <button name="hidden_buttons" class="delete-button hidden" id="button2" onClick = "obrisi()">🗑️</button>
        
        <br>
        <br>
        </div>
    `;

    cardsDiv.innerHTML="";
    cardsDiv.innerHTML = src;
}

async function GetData() {
    var id = "http://localhost:3000/api/posts/"+location.search.substring(1);
    try {
        
        var pOSTS = await axios.get(id);
        await putData(pOSTS.data.post);
        showButtons(pOSTS.data.post);
    }catch (err) {
        console.log(err);
    }
}

async function obrisi()
{
    var id = location.search.substring(1);
    let idstring="http://localhost:3000/api/posts/"+id;
    try{
        await axios.delete(idstring);
        location.href="Recepti.html";
    }
    catch(err)
    {
        console.log(err);
    }
}

function showButtons(post){
    var idname = "id";
    var loginId = localStorage.getItem(idname);
    if(loginId.trim() === post.idKorisnika.trim()){
        const buttons = document.getElementsByName("hidden_buttons");

        buttons.forEach(i=>{
            i.classList.remove("hidden");
        })
    }
  }

GetData();

async function GetUserData(id) {
    var link = "http://localhost:3000/api/users/"+id;
    try {
        var user = await axios.get(link);
        return user.data.user.userName;
    }catch (err) {
        console.log(err);
    }
}

async function updateLike(id){
    var idKorisnika = localStorage.getItem("id");
    if(idKorisnika !== null){
        try{
            var post = await axios.get("http://localhost:3000/api/posts/"+id);
            var t = true;
            post.data.post.lajkovi.forEach(function (i, j){
                if(i === idKorisnika){
                    post.data.post.brojLajkova--;
                    post.data.post.lajkovi.splice(j, 1);
                    t = false;
                    console.log(j, i);

                }
            });
            if(t){
                post.data.post.brojLajkova++;
                post.data.post.lajkovi.push(idKorisnika);
            }
            await axios.put("http://localhost:3000/api/posts/"+id, post.data.post);
            GetData();
        }
        catch (err) {
            console.log(err);
        }
    }
    
}