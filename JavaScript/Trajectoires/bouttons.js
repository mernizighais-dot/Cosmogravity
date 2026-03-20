/*
	Fichier qui rassemble les fonctions des boutons de zoom/dézoom, accélération/décélération et d'initialisation du zoom. 
*/


/*Exemple d'utilisation du module : mobile=bouttons.vitesse(mobile,true); */

/**
 * Bouttons est un module qui est une unité autonome de code qui peut être utilisée et importée dans d'autres fichiers. 
 * Ce module s'exécute immédiatement après sa définition.
 * Ce module rassembles des fonctions liés aux boutons de zoom/dézoom et d'accélération/décélération.
 */
var bouttons = bouttons || (function(){
	return {

		//-----------------------{fonction zoom}-----------------------

		/**
		 * Fonction qui gère le zoom en ajustant les positions spatiales du mobile sur le canvas en fonction d'un facteur de zoom. 
		 * @param {boolean} zoomtype : détermine si on applique un zoom (true) ou un dézoom (false).
		 * @param {Object} mobile : l'objet mobile qui contient les données de position de la particule/fusée. 
		 * @param {Object} canvas : objet canvas sur lequel les mobiles sont dessinés.
		 * @param {Array} mobilefactor : tableau qui stocke les facteurs de zoom de chaque mobile.
		 * @param {Number} compteur : indice qui renseigne sur quel facteur de zoom regarder dans mobilefactor pour ce mobile.
		 * @returns {Array} : [mobile, mobilefactor] mis à jour.
		 */
		zoom: function(zoomtype,mobile,canvas,mobilefactor,compteur) {

				factor=mobilefactor[compteur]; //Je récupère le facteur de zoom de ce mobile

				if(zoomtype){factor*= 1.2;} //Si je zoom je multiplie ce facteur par 1.2
				else{factor/= 1.2;} //Si je dézoom je divise ce facteur par 1.2

				//Je mets à jour les positions spatiales du mobile avec ce nouveau facteur de zoom :
				//Dans le référentiel du mobile :
				mobile.positionspatio.posX1 = factor* mobile.r_part * (Math.cos(mobile.phi) / mobile.rmax) + (canvas.width / 2);
				mobile.positionspatio.posY1 = factor* mobile.r_part * (Math.sin(mobile.phi) / mobile.rmax) + (canvas.height / 2);
				//Dans le référentiel de l'observateur distant :
				mobile.position.posX2 = factor* mobile.r_part_obs * (Math.cos(mobile.phi_obs) / mobile.rmax) + (canvas.width / 2);
				mobile.position.posY2 = factor* mobile.r_part_obs * (Math.sin(mobile.phi_obs) / mobile.rmax) + (canvas.height / 2);

				//Le tableau mobilefactor est mis à jour avec la nouvelle valeur du facteur de zoom :
				mobilefactor[compteur]=factor;
				
				//Je retourne le tableau mobilefactor mis à jour et le mobile avec les nouvelles positions spatiales :
				return [mobile,mobilefactor];
			
		}, 

		//-----------------------{fonction vitesse}-----------------------

		/**
		 * Fonction qui gère l'accélération ou la décélération d'une simulation en fonction du paramètre check.
		 * @param {Object} mobile : l'objet mobile qui contient le dtau de la particule/fusée.
		 * @param {boolean} check : précise si on fait une accélération (true) ou une décélération (false).
		 * @returns {object} : mobile avec le dtau mis à jour.
		 */
		vitesse : function (mobile,check) {
			
			if(check){ //Si je souhaite accélérer :

				if (mobile.dtau >= mobile.Dtau1) { //Si mon dtau est déjà supérieur ou égal au Dtau1 du mobile alors je n'accélère pas plus.
					mobile.dtau = mobile.Dtau1; //Dtau1 est ma limite d'accélération.
				} 
				else { //Si ce n'est pas le cas :
					mobile.dtau += mobile.dtau; //Je double dtau. 
				}
			}	
			else{ //Si je souhaite décélérer :

				if (mobile.dtau <= mobile.Dtau2) { //Si mon dtau est déjà inférieur ou égal au Dtau2 du mobile alors je ne décélère pas plus.
					mobile.dtau = mobile.Dtau2; //Dtau2 est ma limite de décélération.
				} 
				else { //Si ce n'est pas le cas :
					mobile.dtau /= 2; //Je divise dtau par 2.
				}
			}
			return mobile;
		},

		//-----------------------{fonction initialiser}-----------------------

		/**
		 * Fonction utilisée pour réinitialiser le zoom.
		 * @param {Number} nbrfusees : nombre total de mobiles dans la simulation. 
		 * @param {Array} mobilefactor : liste contenant les facteurs de zoom de tous les mobiles.
		 * @param {Object} mobile : l'objet mobile qui contient les données de position de la particule/fusée. 
		 * @param {Number} compteur : indice qui renseigne sur quel facteur de zoom regarder dans mobilefactor pour ce mobile.
		 * @param {Object} canvas : objet canvas sur lequel les mobiles sont dessinés.
		 * @returns {Array} : [mobile, mobilefactor] mis à jour.
		 */
		initialiser : function (nbrfusees,mobilefactor,mobile,compteur,canvas){

			for (key = 1; key <= nbrfusees; key += 1) { //Pour tous les mobiles de la simulation : 
				mobilefactor[key] = Number(document.getElementById("scalefactor").value); //Je remets le mobilefactor à sa valeur par défaut.   		
			}

			for (key = 1; key <= nbrfusees; key += 1) { //Pour tous les mobiles de la simulation : 
				if(key!=cle){ //Si le mobile n'est pas celui qui à la distance initiale la plus grande : 
					mobilefactor[key] = Number(document.getElementById("scalefactor").value)/(r0o2[cle]/r0o2[key]); //Je définis le mobile factor proportionnellement à la distance initiale la plus grande. 
				}
			}

			//Je mets à jour les positions du mobile avec le nouveau mobilefactor :
			//Dans le référentiel du mobile : 
			mobile.positionspatio.posX1 = mobilefactor[compteur] * mobile.r_part * (Math.cos(mobile.phi) / mobile.rmax) + (canvas.width / 2);
			mobile.positionspatio.posY1 = mobilefactor[compteur] * mobile.r_part * (Math.sin(mobile.phi) / mobile.rmax) + (canvas.height / 2);
			//Dans le référentiel de l'observateur distant :
			mobile.position.posX2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.cos(mobile.phi_obs) / mobile.rmax) + (canvas.width / 2);
			mobile.position.posY2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.sin(mobile.phi_obs) / mobile.rmax) + (canvas.height / 2);

			//Je retourne le mobile avec les positions spatiales mises à jour et la liste mobilefactor mise à jour. 
			return [mobile,mobilefactor];
		}
	}

})();