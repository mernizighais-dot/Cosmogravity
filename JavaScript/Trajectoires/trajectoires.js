

/*Ce fichier est appelé pour s'occuper du changement des bouttons (observateur,spationaute,
trajectoire_simple, trajectoire_complete,rebond) quand on clique dessus*/

//-----------------------------------------------------------{init_rebond}--------------------------------------------------

/**
 * Fonction appelé pour eviter le bug d'actualisation du bouton rebond entre 2 rafraichissements.
 */
function init_rebond()
{
  document.getElementById("rebondd").className = "bouttonChoix-inverse";
  document.getElementById("boutton_ammorti").value = "0";
}

//-----------------------------------------------------------{pressionBouttonTrajectoireComplete}--------------------------------------------------

/**
 * Fonction qui est appellé quand on appuie sur trajectoire Complete, elle change le style 
 * du bouton trajectoire simple et le bouton trajectoire complete.
 */
function pressionBouttonTrajectoireComplete() 
{
  //on verifie d'abord le style du bouton
  if (document.getElementById("r1").className == "bouttonChoix-inverse") 
  {
    //On change le style des deux boutons 
    document.getElementById("r1").className = "bouttonChoix"; //trajectoire complete
    document.getElementById("r2").className = "bouttonChoix-inverse"; //trajectoire simple
  }
}

//-----------------------------------------------------------{pressionBouttonTrajectoireSimple}--------------------------------------------------

/**
 * Fonction qui est appellé quand on appuie sur trajectoire simple, elle change le style 
 * du bouton Trajectoire simple et le bouton Trajectoire complete.
 */
function pressionBouttonTrajectoireSimple() 
{
  //on verifie d'abord le style du bouton
  if (document.getElementById("r2").className == "bouttonChoix-inverse") 
  {
    //On change le style des deux boutons 
    document.getElementById("r2").className = "bouttonChoix";//trajectoire simple
    document.getElementById("r1").className = "bouttonChoix-inverse";//trajectoire complete
  }
}

//-----------------------------------------------------------{changerBouttonRebond}--------------------------------------------------

/**
 * Fonction qui est appellé quand on appuie sur rebond, pour changer son style. 
 */
function changerBouttonRebond() 
{
  //on verifie d'abord le style du bouton puis on le change
  if (document.getElementById("rebondd").className == "bouttonChoix-inverse") 
  {
    document.getElementById("rebondd").className = "bouttonChoix";
  } 
  else 
  {
    document.getElementById("rebondd").className = "bouttonChoix-inverse";
  }
}

//-----------------------------------------------------------{pressionBouttonObservateur}--------------------------------------------------

/**
 * Fonction qui est appellé quand on appuie sur observateur, elle change le style 
 * du bouton observateur et le bouton spationaute.
 */
function pressionBouttonObservateur(Kerr) {
  //on verifie d'abord le style du bouton
  if (document.getElementById("r3").className == "bouttonChoix-inverse") {
    document.getElementById("r3").className = "bouttonChoix";
    document.getElementById("r4").className = "bouttonChoix-inverse";

    if (Kerr){
      document.getElementById("case_depasser").style="display: none;";
    }

  }
}

//-----------------------------------------------------------{pressionBouttonMobileKerr}--------------------------------------------------

/**
 * Fonction qui est appellé quand on appuie sur spationaute, elle change le style 
 * du bouton observateur et le bouton spationaute.
 */
function pressionBouttonMobile(Kerr) {
  //on verifie d'abord le style du bouton
  if (document.getElementById("r4").className == "bouttonChoix-inverse") {
    document.getElementById("r4").className = "bouttonChoix";
    document.getElementById("r3").className = "bouttonChoix-inverse";

    if(Kerr){
      document.getElementById("case_depasser").style="display: block;";
    }

  }
}

//-----------------------------------------------------------{ammort}--------------------------------------------------

/**
 * Fonction associée à rebond qui fait afficher la barre du coefficient d'amortissement.
 */
function ammort() 
{
  //verifier si la barre n'est pas affichée
  if (document.getElementById("boutton_ammorti").value == "0") 
  {
    document.getElementById("boutton_ammorti").value = "1"; //on stocke la valeur à 1 pour savoir que c'est affiché à present
    document.getElementById("barre_reb").style.display = "block"; //on l'affiche
    document.getElementById('ammorti').innerHTML=document.getElementById("reb").value; //on met à jour la valeur

  } 
  //Si la barre est affichée
  else {
    document.getElementById("boutton_ammorti").value = "0";//on stocke la valeur à 0 pour savoir que ce n'est pas affiché à present
    document.getElementById("barre_reb").style.display = "none"; //on le cache
  
  }
}

//-----------------------------------------------------------{ammort_photon}--------------------------------------------------

/**
 * Fonction associée à rebond qui active le robond pour photon.
 */
function ammort_photon() {
  //verifier si la barre n'est pas affichée
  if (document.getElementById("boutton_ammorti").value == "0") 
  {
    document.getElementById("boutton_ammorti").value = "1";//on met la valeur à 1 pour savoir que c'est affiché
  } 
  else 
  {
    document.getElementById("boutton_ammorti").value = "0"; //on stocke la valeur à 1 pour savoir que c'est affiché
  }
}

//-----------------------------------------------------------{ammortUpdate}--------------------------------------------------

/**
 * Fonction qui s'occupe de l'actualisation de la valeur sélectionnée du 
 * coefficient d'amortissement pour visuel avec chiffre.
 * @param {*} val : valeur avec la quelle on va mettre à jour la barre.
 */
function ammortUpdate(val)
{
  document.getElementById('ammorti').innerHTML=val/100; //on met à jour la valeur
}
