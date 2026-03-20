
/*
  Fichier qui gère les avertissements de Univers et Trajectoire.
*/


//---------------------------------{avertissement_trajectoire}---------------------------------

/**
 * Fonction qui fait apparaître ou disparaître le message d'avertissement de Trajectoires en fonction de si il
 * était visible ou non.
 */
function avertissement_trajectoire(typePage) {

  var texte = o_recupereJson(); //Je récupère les textes du json.
  //Je récupère l'élément span d'ID "txt_avertissement_trajectoire" qui est l'espace pour l'avertissement :
  var span = document.getElementById("txt_avertissement_trajectoire"); 

  //Remplit l'espace avec le texte de l'avertissement :
  if (typePage == 1)
    span.innerHTML = texte.pages_trajectoire.avertissement;
  else if (typePage == 2)
    span.innerHTML = texte.pages_trajectoire.avertissementSCH2;
  else if (typePage == 3)
    span.innerHTML = texte.pages_trajectoire.avertissementSCH3;
  else if (typePage == 4)
    span.innerHTML = texte.pages_trajectoire.avertissementSCH4;
  else if (typePage == 5)
    span.innerHTML = texte.pages_trajectoire.avertissementKERR;
  else if (typePage == 6)
    span.innerHTML = texte.pages_trajectoire.avertissementKERR2;


  //Si on appuie dessus :
  if(span.style.display == "none" || span.style.display == "") { //Alors qu'il était caché :

    //Il devient visible :
    span.style.display = "inline";
  } else { //Alors qu'il tait visible :

    //Il devient caché :
    span.style.display = "none";
  }
}

//---------------------------------{avertissement_univers}---------------------------------

/**
 * Fonction qui fait apparaître ou disparaître le message d'avertissement de Univers en fonction de si il
 * était visible ou non.
 */
function avertissement_univers() {

  var texte = o_recupereJson(); //Je récupère les textes du json.
  //Je récupère l'élément span d'ID "txt_avertissement_univers" qui est l'espace pour l'avertissement :
  var span = document.getElementById("txt_avertissement_univers");

  //Remplit l'espace avec le texte de l'avertissement :
  span.innerHTML = texte.page_univers_general.avertissement;

  //Si on appuie dessuis :
  if(span.style.display == "none" || span.style.display == "") { //Alors qu'il était caché :

    //Il devient visible :
    span.style.display = "inline";
  } else { //Alors qu'il tait visible :

    //Il devient caché :
    span.style.display = "none";
  }
}