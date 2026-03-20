/*
		Fonctions gérant la sauvegarde de l'expérience passée lorsque l'on clique sur le bouton valeurs précédentes entre autres.
*/



//------------------------------------------------------{FONCTIONS SAVE}------------------------------------------------------
/*Les fonctions qui suivent permettent de sauvegarder les données d'une simulation.*/


//-------------------{fonction save_generalise}-------------------

/**
 * Fonction générale qui récupère divers paramètres de la page liés à la simulation et qui les sauvegarde dans le storage. 
 * @param {boolean} SCH : permet de savoir si je suis dans le cas de la métrique de Schwarzschild (true) ou non.
 * @param {boolean} baryonique_SCH : permet de savoir si je suis dans cas baryonique (true) ou non baryonique.
 */
function save_generalise(SCH, baryonique_SCH){

	//Récupération des données communes à Kerr et SCH :
	M = document.getElementById("M").value;
	traject_type = document.getElementById("traject_type").value;
	traject_type2 = document.getElementById("traject_type2").value;
	var graph_check = true;

	if (document.getElementById("toggle").checked == false) { //Je vérifie si la case pour le graphe du potentiel est cochée.
		graph_check = false; //Si non je mets la variable à false.
	}

	//Stockage des données communes à Kerr et SCH :
	sessionStorage.setItem("M", M);
	sessionStorage.setItem("traject_type", traject_type);
	sessionStorage.setItem("traject_type2", traject_type2);
	sessionStorage.setItem("graph_check", graph_check);

	if (SCH){ //Si je suis dans la métrique de SCH.

		//Récupération des données communes à la métrique de SCH :
		r_phy = document.getElementById("r_phy").value;
		savenbfuseesrecupvaleurs = document.getElementById("nombredefusees").value;

		//Sauvegarde des données communes à la métrique de SCH :
		sessionStorage.setItem("nombredefuseesrecupvaleurs", savenbfuseesrecupvaleurs);
		sessionStorage.setItem("r_phy", r_phy);
	}
	else{ //Si je suis dans la métrique de Kerr.

		//Récupération des données communes à la métrique de Kerr :
		r0 = document.getElementById("r0").value;
		J = document.getElementById("J").value;
		teta = document.getElementById("teta").value;
		phi0 = document.getElementById("phi0").value;
		var rh_plus_check = true;

		if (document.getElementById("traject_type2").value == "mobile") { //Si je suis en mode spationaute/photon. 
			if (document.getElementById("depasser").checked == false){ //Si le case dépasser Rh+ n'est pas cochée.
				rh_plus_check = false; //Je stocke false dans la variable.
			}
		}

		//Sauvegarde des données communes à la métrique de Kerr.
		sessionStorage.setItem("r0", r0);
		sessionStorage.setItem("J", J);
		sessionStorage.setItem("teta", teta);
		sessionStorage.setItem("phi0", phi0);
		sessionStorage.setItem("rh_plus_check", rh_plus_check);
	}

	if(baryonique_SCH){ //Si je suis dans la métrique de SCH et que je suis en baryonique.

		//Récupération des données communes :
		boutton_ammorti = document.getElementById("boutton_ammorti").value;

		//Sauvegarde des données communes.
		sessionStorage.setItem("boutton_ammorti", boutton_ammorti);

	}

}

//-------------------{fonction save_SCH_rocket_generale}-------------------

/**
 * Fonction générale qui dans le cas de la métrique de Schwarzschild récupère certains paramètres communs aux simulations et les sauvegarde.
 * @param {Number} nbrderockets : le nombre de mobiles qu'il y a dans la simulation. 
 * @param {boolean} photon : Si le mobile est un photon (true) ou non. 
 */
function save_SCH_rocket_generale(nbrderockets, photon){

	for (count = 1; count <= nbrderockets; count += 1) { //Pour toutes les fusées :

		//Je récupère les paramètres communs :
		r0 = document.getElementById("r0"+count.toString()+"").value;
		phi0= document.getElementById("phi0"+count.toString()+"").value;
		teta = document.getElementById("teta"+count.toString()+"").value;

		if(photon==false){ //Dans le cas spécifique ou la particule n'est pas un photon je récupère et sauvegarde aussi la vitesse.
			v0= document.getElementById("v0"+count.toString()+"").value;
			sessionStorage.setItem("v0"+count.toString()+"", v0 );
		}

		//Je stocke les paramètres communs :
		sessionStorage.setItem("r0"+count.toString()+"", r0);
		sessionStorage.setItem("phi0"+count.toString()+"", phi0);
		sessionStorage.setItem("teta"+count.toString()+"", teta);
		
	}	

	if(photon==false){ //Si la particule n'est pas un photon alors je récupère et sauvegarde le paramètre lié au pilotage. 
		pourcentage_vphi_pilotage = document.getElementById("pourcentage_vphi_pilotage").value;
		sessionStorage.setItem("pourcentage_vphi_pilotage", pourcentage_vphi_pilotage);
	}

}

//-------------------{fonction save_nbfusees}-------------------

/**
 * Fonction qui permet de récupérer et stocker le nombre de fusées d'une simulation. 
 */
function save_nbfusees() {
	savenbfusees = document.getElementById("nombredefusees").value;
	sessionStorage.setItem("nombredefusees", savenbfusees);
}

//-------------------{fonction save_schwarshild_massif}-------------------

/**
 * Fonction qui permet de récupérer et stocker les paramètres d'une simulation dans le cas Schwarzschild masse et mobile baryoniques.
 * @param {Number} nbrderockets : nombre de mobiles qu'il y a dans la simulation. 
 */
function save_schwarshild_massif(nbrderockets) {
	save_generalise(true, true);
	save_SCH_rocket_generale(nbrderockets, false);

	//Récupération et sauvegarde de la valeur de l'amortissement du rebond : 
	reb = document.getElementById("reb").value;
	sessionStorage.setItem("reb", reb);
}

//-------------------{fonction save_schwarshild_massif_nonBar}-------------------

/**
 * Fonction qui permet de récupérer et stocker les paramètres d'une simulation dans le cas Schwarzschild masse et/ou mobile non baryonique(s).
 * @param {Number} nbrderockets : nombre de mobiles qu'il y a dans la simulation.
 */
function save_schwarshild_massif_nonBar(nbrderockets) {
	save_generalise(true, false);
	save_SCH_rocket_generale(nbrderockets, false);
}

//-------------------{fonction save_schwarshild_photon_nonBar}-------------------

/**
 * Fonction qui permet de récupérer et stocker les paramètres d'une simulation dans le cas Schwarzschild masse non baryonique et photon.
 * @param {Number} nbrderockets : nombre de mobiles qu'il y a dans la simulation.
 */
function save_schwarshild_photon_nonBar(nbrderockets) {
	save_generalise(true, false);
	save_SCH_rocket_generale(nbrderockets, true);
}

//-------------------{fonction save_schwarshild_photon}-------------------

/**
 * Fonction qui permet de récupérer et stocker les paramètres d'une simulation dans le cas Schwarzschild masse baryonique et photon.
 * @param {Number} nbrderockets : nombre de mobiles qu'il y a dans la simulation.
 */
function save_schwarshild_photon(nbrderockets) {
	save_generalise(true, true);
	save_SCH_rocket_generale(nbrderockets, true);
}

//-------------------{fonction save_kerr_massif}-------------------

/**
 * Fonction qui permet de récupérer et stocker les paramètres d'une simulation dans le cas Kerr Particule massive.
 */
function save_kerr_massif() {

	//Récupération des données non générales à Kerr :
	v0= document.getElementById("v0").value;
	pourcentage_vphi_pilotage = document.getElementById("pourcentage_vphi_pilotage").value;

	save_generalise(false, false); //Récupération et sauvegarde des données générales à Kerr.

	//Stockage des données non générale à Kerr :
	sessionStorage.setItem("v0", v0);
	sessionStorage.setItem("pourcentage_vphi_pilotage", pourcentage_vphi_pilotage);

}


//------------------------------------------------------{FONCTIONS LOAD}------------------------------------------------------
/*Les fonctions qui suivent permettent de récupérer les élements sauvegardés dans le stockage de la dernière simulation et de les réutiliser pour une autre simulation.*/

//-------------------{fonction load_generalise}-------------------

/**
 * Fonction qui permet de récupérer les éléments communs sauvegardés et de les réutiliser.
 * @param {boolean} SCH : Permet de savoir si on est dans la métrique de Schwarzschild (true) ou pas.
 */
function load_generalise(SCH){

	if(SCH){ //Dans le cas de la métrique de SCH.

		if (sessionStorage.getItem("nombredefuseesrecupvaleurs")){ //Si j'ai un nombre de mobiles stockés.
			var nbfuseesrecupvaldesession = sessionStorage.getItem("nombredefuseesrecupvaleurs"); //Je récupère ce nombre.
			nbrderockets= nbfuseesrecupvaldesession; //Je le stocke dans une nouvelle variable.
			document.getElementById("nombredefusees").value = sessionStorage.getItem("nombredefuseesrecupvaleurs"); //Je remets dans la simulation ce nombre de mobiles.
		}

		supprHtml(); //Je supprime l'html présent sur la page.
		genereHtml(); //Pour en générer un nouveau ensuite.
		save_nbfusees(); //Je sauvegarde le nombre de fusées. 
		updatenbredefusees(); //Je fais une initialisation générale sur ce nombre de fusées. 

		if (sessionStorage.getItem("r01")) { //Dans le cas où il y a quelque chose de stocker. 

			//Je récupère les données communes et je les remets : 
			document.getElementById("r_phy").value = sessionStorage.getItem("r_phy");
			document.getElementById("M").value = sessionStorage.getItem("M");
			document.getElementById("traject_type").value = sessionStorage.getItem("traject_type");
			document.getElementById("traject_type2").value = sessionStorage.getItem("traject_type2");

			var graph_check = sessionStorage.getItem("graph_check");

			if (graph_check == "false") { //Si la case pour le potentiel n'est pas cochée.
				document.getElementById("toggle").checked = false; //Alors je la décoche.
			}

			for (count = 1; count <= nbrderockets; count += 1) { //Pour toutes les fusées je remets les données communes :
				document.getElementById("r0"+count.toString()+"").value=sessionStorage.getItem("r0"+count.toString()+"");
				document.getElementById("teta"+count.toString()+"").value=sessionStorage.getItem("teta"+count.toString()+"");
				document.getElementById("phi0"+count.toString()+"").value=sessionStorage.getItem("phi0"+count.toString()+"");
			}


			//Je remets si c'était une trajectoire simple ou complète :
			if (document.getElementById("traject_type").value == "simple") {
				pressionBouttonTrajectoireSimple();
			} else if (document.getElementById("traject_type").value == "complete") {
				pressionBouttonTrajectoireComplete();
			}

			var inputNbfusees = document.getElementById("nombredefusees"); 
			var labelNbfusees = document.getElementById("labelnumberfusees");

			//Je fais apparaître la case pour choisir le nombre de mobile si je suis en mode observateur sinon non :
			if (document.getElementById("traject_type2").value == "observateur") {
				pressionBouttonObservateur(false); //Je me mets en mode observateur si c'est ce qui était stocké.
				inputNbfusees.style.display = "inline";
				labelNbfusees.style.display = "inline"; 
			} else if (document.getElementById("traject_type2").value == "mobile") {
				pressionBouttonMobile(false); //Je me mets en mode spationaute/photon si c'est ce qui était stocké.
				inputNbfusees.style.display = "none"; 
				labelNbfusees.style.display = "none"; 
			}

		}
	}
	else{//Je suis dans la métrique de Kerr.

		if (sessionStorage.getItem("r0")) { //Si il y a quelque chose de stocké.

			//Je récupère et remets les données communes : 
			document.getElementById("r0").value = sessionStorage.getItem("r0");
			document.getElementById("J").value = sessionStorage.getItem("J");
			document.getElementById("M").value = sessionStorage.getItem("M");
			document.getElementById("teta").value = sessionStorage.getItem("teta");
			document.getElementById("phi0").value = sessionStorage.getItem("phi0");
			document.getElementById("traject_type").value = sessionStorage.getItem("traject_type");
			document.getElementById("traject_type2").value = sessionStorage.getItem("traject_type2");

			var graph_check = sessionStorage.getItem("graph_check");
			var rh_plus_check = sessionStorage.getItem("rh_plus_check");

			if (graph_check == "false") { //Si la case pour le potentiel n'est pas cochée :
				document.getElementById("toggle").checked = false; //Alors je la décoche. 
			}

			//Je récupère et remets si la trajectoire était simple ou complète :
			if (document.getElementById("traject_type").value == "simple"){
				pressionBouttonTrajectoireSimple();
			} else if (document.getElementById("traject_type").value == "complete") {
				pressionBouttonTrajectoireComplete();
			}

			//Je récupère et remets si j'étais en mode observateur ou spationaute/photon :
			if (document.getElementById("traject_type2").value == "observateur") {
				pressionBouttonObservateur(true);
			} else if (document.getElementById("traject_type2").value == "mobile") {
				pressionBouttonMobile(true);
				if (rh_plus_check=="true"){ //Dans le cas où la case dépasser rh+ était cochée :
					document.getElementById("depasser").checked = true; //Alors je la coche. 
				}
			}

		}

	}
}

//-------------------{fonction load_generalise_SCH_bar}-------------------

/**
 * Fonction qui permet de récupérer les éléments communs sauvegardés et de les réutiliser dans le cas où il y a un rebond possible.
 */
function load_generalise_SCH_bar(){

	if (sessionStorage.getItem("r01")) { //Si il y a quelque chose de stocké :

		document.getElementById("boutton_ammorti").value = sessionStorage.getItem("boutton_ammorti");

		//Je clique ou non sur le bouton rebond en fonction de ce qui est stocké :
		if (document.getElementById("boutton_ammorti").value == "1") {
			document.getElementById("rebondd").className = "bouttonChoix";
		} 
		else if (document.getElementById("boutton_ammorti").value == "0") {
			document.getElementById("rebondd").className = "bouttonChoix-inverse";
		}

		//Pour savoir si on affiche ou pas le bouton de rebond dans le cas d'un trou noir :
		if (document.getElementById("r_phy").value == "0" || document.getElementById("r_phy").value == "" ) {document.getElementById("rebondd").style.display="none";} 
		else{document.getElementById("rebondd").style.display="inline";}

	}
}

//-------------------{fonction load_generalise_pilotage}-------------------

/**
 * Fonction qui permet de récupérer les élements communs sauvegardés et de les réutiliser dans le cas où il y a un pilotage possible en SCH.
 */
function load_generalise_pilotage(){

	if (sessionStorage.getItem("r01")) { //Si il y a quelque chose de stocké :

		//Je remets la valeur de X choisie pour le pilotage :
		document.getElementById("pourcentage_vphi_pilotage").value = sessionStorage.getItem("pourcentage_vphi_pilotage");

		var labelPourcentageVphiPilotage = document.getElementById("label_pourcentage_vphi_pilotage");
		var inputPourcentageVphiPilotage = document.getElementById("pourcentage_vphi_pilotage");

		//En fonction de si je suis en mode observateur ou spationaute je fais apparaître ou non le choix de la variable de pilotage X :
		if (document.getElementById("traject_type2").value == "observateur") {
			labelPourcentageVphiPilotage.style.display = "none";
			inputPourcentageVphiPilotage.style.display = "none";
		} 
		else if (document.getElementById("traject_type2").value == "mobile") {
			labelPourcentageVphiPilotage.style.display = "inline";
			inputPourcentageVphiPilotage.style.display = "inline";

		}
	}
}

//-------------------{fonction load_schwarshild_massif}-------------------

/**
 * Fonction qui permet de récupérer les élements sauvegardés et de les réutiliser dans le cas de SCH masse et mobile baryoniques.
 */
function load_schwarshild_massif() {

	load_generalise(true); //Gestion des paramètres communs.
	load_generalise_SCH_bar(); //Gestion du rebond possible.
	load_generalise_pilotage(); //Gestion du pilotage possible.

	if (sessionStorage.getItem("r01")) {//Si quelque chose est stocké :

		for (count = 1; count <= nbrderockets; count += 1) {//Pour toutes les fusées je récupère et remets les valeurs de v0 :
			document.getElementById("v0"+count.toString()+"").value=sessionStorage.getItem("v0"+count.toString()+"");
		}

		//Je récupère et remets la valeur de l'amortissement du rebond : 
		document.getElementById("reb").value = sessionStorage.getItem("reb");

		//Si on a appuyé sur le bouton rebond ou non, j'affiche ou non la barre pour choisir l'amortissement avec sa valeur précédente :
		if (document.getElementById("boutton_ammorti").value == "1") {
			document.getElementById("barre_reb").style.display = "block";
			document.getElementById('ammorti').innerHTML = document.getElementById("reb").value / 100;
		} 
		else if (document.getElementById("boutton_ammorti").value == "0") {
			document.getElementById("barre_reb").style.display = "none";
			document.getElementById('ammorti').innerHTML = document.getElementById("reb").value / 100;
		}
		
  	}
}

//-------------------{fonction load_schwarshild_massif_nonBar}-------------------

/**
 * Fonction qui permet de récupérer les élements sauvegardés et de les réutiliser dans le cas de SCH masse et/ou mobile non baryonique(s).
 */
function load_schwarshild_massif_nonBar() {

	load_generalise(true); //Gestion des paramètres communs.
	load_generalise_pilotage(); //Gestion du pilotage possible. 

  	if (sessionStorage.getItem("r01")) { //Si quelque chose est stocké :
		for (count = 1; count <= nbrderockets; count += 1) { //Pour toutes les fusées je récupère et remets les valeurs de v0 :
			document.getElementById("v0"+count.toString()+"").value=sessionStorage.getItem("v0"+count.toString()+"");
		}
  	}
}

//-------------------{fonction load_schwarshild_photon}-------------------

/**
 * Fonction qui permet de récupérer les élements sauvegardés et de les réutiliser dans le cas de SCH masse baryonique et photon.
 */
function load_schwarshild_photon() {
	load_generalise(true); //Gestion des paramètres communs.
	load_generalise_SCH_bar(); //Gestion du rebond possible.
}

//-------------------{fonction load_schwarshild_photon_nonBar}-------------------

/**
 * Fonction qui permet de récupérer les élements sauvegardés et de les réutiliser dans le cas de SCH masse non baryonique et photon.
 */
function load_schwarshild_photon_nonBar() {
	load_generalise(true); //Gestion des paramètres communs.
}

//-------------------{fonction load_kerr_massif}-------------------

/**
 * Fonction qui permet de récupérer les élements sauvegardés et de les réutiliser dans le cas de Kerr Particule Massive.
 */
function load_kerr_massif() {

	load_generalise(false); //Gestion des paramètres communs

	if (sessionStorage.getItem("r0")) { //Si quelque chose est stocké :

		//Je récupère et remets la valeur de v0 et de la variable de pilotage X :
		document.getElementById("v0").value = sessionStorage.getItem("v0"); 
		document.getElementById("pourcentage_vphi_pilotage").value = sessionStorage.getItem("pourcentage_vphi_pilotage");


		var labelPourcentageVphiPilotage = document.getElementById("label_pourcentage_vphi_pilotage");
		var inputPourcentageVphiPilotage = document.getElementById("pourcentage_vphi_pilotage");

		//Si je suis en mode observateur je ne fais pas apparaître le choix de la variable de pilotage X et si je suis en mode spationaute oui : 
		if (document.getElementById("traject_type2").value == "observateur") {
			labelPourcentageVphiPilotage.style.display = "none";
			inputPourcentageVphiPilotage.style.display = "none";
		} 
		else if (document.getElementById("traject_type2").value == "mobile") {
			labelPourcentageVphiPilotage.style.display = "inline";
			inputPourcentageVphiPilotage.style.display = "inline";
		}

	}
}

//-------------------{fonction load_kerr_photon}-------------------

/**
 * Fonction qui permet de récupérer les élements sauvegardés et de les réutiliser dans le cas de Kerr Photon.
 */
function load_kerr_photon() {
	load_generalise(false); //Gestion des paramètres communs.
}
