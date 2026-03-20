/*
	Dans ce fichier on a tout ce qui concerne la gestion du joystick du pilotage. 
*/


/**
 * Pilotage est une fonction JS qui est définie et immédiatement exécutée et qui permet de créer un Joystick.
 * @param {String} container : ID de l'élément HTML dans lequel le joystick sera ajouté.
 * @param {Object} parameters : Contient diverses propriétés pour configurer le joystick. 
 */
var Pilotage = (function(container, parameters)
{
	parameters = parameters || {}; //Si parameters est "null" ou "undefined" ou autre alors il est remplacé par un objet vide. 
	//Lignes qui définissent les valeurs par défauts pour les parameters si elles ne sont pas fournies : 
	var title = (typeof parameters.title === "undefined" ? "joystick" : parameters.title), //Par défaut le titre est "joystick".
	width = (typeof parameters.width === "undefined" ? 0 : parameters.width), //width est défini par défaut à 0. Ainsi la largeur du conteneur sera utilisée.
	height = (typeof parameters.height === "undefined" ? 0 : parameters.height), //height est défini par défaut à 0. Ainsi la hauteur du conteneur sera utilisée. 
	internalFillColor = (typeof parameters.internalFillColor === "undefined" ? "#d73280" : parameters.internalFillColor), //internalFillColor par défaut est défini à #d73280.
	internalLineWidth = (typeof parameters.internalLineWidth === "undefined" ? 2 : parameters.internalLineWidth), //internalLineWidth par défaut est défini à 2.
	internalStrokeColor = (typeof parameters.internalStrokeColor === "undefined" ? "#003300" : parameters.internalStrokeColor), //internalStrokeColor par défaut est défini à #003300.
	externalLineWidth = (typeof parameters.externalLineWidth === "undefined" ? 2 : parameters.externalLineWidth), //externalLindeWidth par défaut est défini à 2. 
	externalStrokeColor = (typeof parameters.externalStrokeColor ===  "undefined" ? "#d73280" : parameters.externalStrokeColor), //externalStrokeColor par défaut est défini à #d73280. 
	autoReturnToCenter = (typeof parameters.autoReturnToCenter === "undefined" ? true : parameters.autoReturnToCenter); //Par défaut autoReturnToCenter prend la valeur true. 
	

	var objContainer = document.getElementById(container); //Je récupère l'élement d'ID container et je le stocke dans la variable objContainer. 
	var canvasjoystick = document.createElement("canvas"); //Je créé un nouvel élément "canvas" que je stocke dans la variable canvasjoystick. 
	canvasjoystick.id = title; //L'ID du canvasjoystick devient le title. 

	//Si la largeur et la hauteur sont nulles alors elles sont définies à la longueur et la largeur du container :
	if(width === 0) { width = objContainer.clientWidth; }
	if(height === 0) { height = objContainer.clientHeight;}

	//Je créé un espace supplémentaire autour du joystick pour éviter que les éléments ne soient trop près des bords : 
	canvasjoystick.width = width+50;
	canvasjoystick.height = height+50;

	//On fait en sorte que le joystick reste à une position fixe sur la page même lors du défilement : 
    canvasjoystick.style.position = "fixed";
    
	//J'ajoute l'élément "canvas" que je viens de créer au container : 
	objContainer.appendChild(canvasjoystick);

	//Je récupère le contexte de dession 2D pour l'élément "canvas" : 
	var contextjoystick=canvasjoystick.getContext("2d");

	//J'initialise différentes variables :
	var pressed = 0; //Pour vérifier si le bouton de la souris est enfoncé, si 0 non et si 1 oui. 
	var phiValue = 0; //Valeur de l'angle du joystick. 
    var circumference = 2 * Math.PI; //Circonférence d'un cercle en radians.
    var Radius = 20; //Rayon des boutons du joystick.
	//Pour centrer le joystick :
	var centerX = canvasjoystick.width / 2;
	var centerY = canvasjoystick.height / 2;


	//J'ajoute des écouteurs d'évenements si on appui sur la souris ou bien si on la relâche :
	canvasjoystick.addEventListener("mousedown",onMouseDown,false); //Si on appuie dessus la fonction onMouseDown est appelée.
	canvasjoystick.addEventListener("mouseup",onMouseUp,false); //Si on relâche la fonction onMouseUp est appelée. 
	
	//J'appelle des fonctions pour dessiner les boutons du joystick : 
	drawTopButton();
	drawBottomButton();


	//-------------------METHODES PRIVEES--------------------------
	/* Fonctions définies à l'intérieur de Pilotage qui sont accessibles uniquement dans ce contexte. */

	//-------------------{fonction drawTopButton}--------------------------

	/**
	 * Fonction servant à dessiner le bouton du haut du joystick.
	 */
	function drawTopButton()
	{
		contextjoystick.beginPath(); //Début du nouveau chemin du dessin. 
		contextjoystick.fillStyle = "FireBrick"; //Donne au bouton une couleur rougeâtre.
		contextjoystick.arc(centerX,centerY-40,Radius,0,circumference); //Dessine un cercle bien positionné.
		contextjoystick.lineWidth = internalLineWidth; //Définit l'épaisseur du countour du cercle.
		contextjoystick.strokeStyle = internalStrokeColor; //Définit la couleur du contour du cercle.
		contextjoystick.stroke(); //Trace le countour du cercle.
        contextjoystick.font = "bold 15px serif"; //Définit le style du texte à afficher sur le bouton. 
		contextjoystick.fillText("Vφ+",centerX-12,centerY-35); //Ajoute une étiquette au bouton. 
	}

	//-------------------{fonction drawBottomButton}--------------------------

	/**
	 * Fonction servant à dessiner le bouton du bas du joystick.
	 */
	function drawBottomButton()
	{
		contextjoystick.beginPath(); //Début du nouveau chemin du dessin. 
		contextjoystick.fillStyle = "FireBrick"; //Donne au bouton une couleur rougeâtre.
		contextjoystick.arc(centerX,centerY+15,Radius,0,circumference); //Dessine un cercle bien positionné.
		contextjoystick.lineWidth = internalLineWidth; //Définit l'épaisseur du countour du cercle.
		contextjoystick.strokeStyle = internalStrokeColor; //Définit la couleur du contour du cercle.
		contextjoystick.stroke(); //Trace le countour du cercle.
        contextjoystick.font = "bold 15px serif"; //Définit le style du texte à afficher sur le bouton. 
		contextjoystick.fillText("Vφ-",centerX-10,centerY+20); //Ajoute une étiquette au bouton. 
	}

	//-------------------{fonction GetPhi}--------------------------

	/**
	 * Fonction qui renvoie la valeur de phiValue arrondie à l'entier le plus proche
	 * @returns {Number} phiValue arrondie à l'entier le plus proche. 
	 */
	this.GetPhi = function ()
	{return (phiValue).toFixed();}

	//-------------------{fonction isInsideTopButton}--------------------------

	/**
	 * Fonction qui vérifie si les coordonées d'un clic de souris se trouvent à l'intérieur du bouton du haut du joystick. 
	 * @param {Number} positionX : coordonnée x du clic de souris.
	 * @param {Number} positionY : coordonnée y du clic de souris.
	 * @returns {boolean} : qui me dit si je suis à l'intérieur du bouton du haut ou non. 
	 */
	function isInsideTopButton(positionX,positionY)
	{
		return ((positionX<centerX+Radius)&&(positionX>centerX-Radius)&&(positionY<centerY-40+Radius)&&(positionY>centerY-40-Radius));
	}

	//-------------------{fonction isInsideBottomButton}--------------------------

	/**
	 * Fonction qui vérifie si les coordonées d'un clic de souris se trouvent à l'intérieur du bouton du bas du joystick. 
	 * @param {Number} positionX : coordonnée x du clic de souris.
	 * @param {Number} positionY : coordonnée y du clic de souris.
	 * @returns {boolean} : qui me dit si je suis à l'intérieur du bouton du bas ou non. 
	 */
	function isInsideBottomButton(positionX,positionY)
	{
		return ((positionX<centerX+Radius)&&(positionX>centerX-Radius)&&(positionY<centerY+15+Radius)&&(positionY>centerY+15-Radius));
	}

	//-------------------{fonction onMouseDown}--------------------------
	
	/**
	 * Fonction qui se déclenche lorsque l'utilisateur clique sur le canvas du joystick avec la souris. 
	 * @param {Object} event : événement déclenché par l'action de l'utilisateur.
	 */
	function onMouseDown(event)
	{
		pressed = 1; //Marque que la souris est enfoncée. 

		//Je récupère la position du curseur de la souris par rapport à la fenêtre du navigateur :
		posX = event.clientX;
		posY = event.clientY;

		//Donne la position relative du curseur de la souris à l'intérieur du canvas du joystick :
		posX -= canvasjoystick.offsetLeft;
		posY -= canvasjoystick.offsetTop;


		if(isInsideTopButton(posX,posY))
		{ //Si le clic de souris est à l'intérieur du bouton du haut :

			//Redessine le bouton du haut mais cette fois rempli en rouge foncé avec le texte en noir :
			contextjoystick.beginPath();  
			contextjoystick.fillStyle = "FireBrick"; 
			contextjoystick.arc(centerX,centerY-40,Radius,0,circumference); 
			contextjoystick.lineWidth = internalLineWidth; 
			contextjoystick.strokeStyle = internalStrokeColor; 
			contextjoystick.fill(); 
			contextjoystick.fillStyle = "Black"; 
        	contextjoystick.font = "bold 15px serif"; 
			contextjoystick.fillText("Vφ+",centerX-12,centerY-35);
			drawBottomButton();

			incrPhiValue(); //J'incrémente la valeur de phiValue avec la fonction incrPhiValue.
		}
		else if(isInsideBottomButton(posX,posY))			
		{ //Si le clic de souris est à l'intérieur du bouton du bas :

			//Redessine le bouton du bas mais cette fois rempli en rouge foncé avec le texte en noir :
			contextjoystick.beginPath();
			contextjoystick.fillStyle = "FireBrick";
			contextjoystick.arc(centerX,centerY+15,Radius,0,circumference);
			contextjoystick.lineWidth = internalLineWidth;
			contextjoystick.strokeStyle = internalStrokeColor;
			contextjoystick.fill();
			contextjoystick.fillStyle = "Black";
        	contextjoystick.font = "bold 15px serif";
			contextjoystick.fillText("Vφ-",centerX-10,centerY+20);
			drawTopButton();

			decrPhiValue(); //Je décrémente la valeur de phiValue avec la fonction decrPhiValue.
		}
	}

	//-------------------{fonction onMouseUp}--------------------------

	/**
	 * Fonction qui se déclenche lorsque l'utilisateur relâche le clic de la souris à l'intérieur du canvas du joystick. 
	 * @param {Object} event : événement déclenché par l'action de l'utilisateur.
	 */
	function onMouseUp(event)
	{
		pressed = 0; //Marque que la souris est relâchée.
		phiValue = 0; //Réinitialise la valeur de phiValue à 0.

		//Efface le contenu dessiné sur le canvas du joystick.
		contextjoystick.clearRect(0,0,canvas.width,canvas.height);

		//Redessine les boutons du haut et du bas du joystick comme ils l'étaient avant qu'on ne clique dessus.
		drawTopButton();
	    drawBottomButton();
	}

	//-------------------{fonction incrPhiValue}--------------------------

	/**
	 * Fonction asynchrone qui incrémente la valeur de phiValue progressivement si la souris est enfoncée.
	 * Le fait d'avoir une fonction asynchrone permet d'utiliser await. 
	 */
	async function incrPhiValue()
	{
		press = pressed; //Je stocke dans une variable si la souris est enfoncée ou non.

		for(var i = 0; (i < 500) && (press === 1); i++)
		{//Si la souris est enfoncée pour i allant de 0 à 499 :

			phiValue++; //J'incrémente la valeur de phiValue jusqu'à 500 fois. 
			await sleepNow(1000); //J'attends une seconde avant la prochaine incrémentation.
			press = getPressed(); //Met à jour si la souris est enfoncée actuellement ou non. 
			
		}
		
	}

	//-------------------{fonction decrPhiValue}--------------------------

	/**
	 * Fonction asynchrone qui décrémente la valeur de phiValue progressivement si la souris est enfoncée.
	 * Le fait d'avoir une fonction asynchrone permet d'utiliser await. 
	 */
	async function decrPhiValue()
	{
		press = pressed;//Je stocke dans une variable si la souris est enfoncée ou non.

		for(var i = 0; (i < 500) && (press === 1); i++)
		{//Si la souris est enfoncée pour i allant de 0 à 499 :

			phiValue--; //Je décrémente la valeur de phiValue jusqu'à 500 fois.
			await sleepNow(1000); //J'attends une seconde avant la prochaine incrémentation.
			press = getPressed(); //Met à jour si la souris est enfoncée actuellement ou non.
		
		}

	}

	//-------------------{fonction sleepNow}--------------------------
	
	/**
	 * Fonction qui retourne une promesse. Cette promesse est résolue aprés un delai spécifié delay. Une promesse étant la représentation de l'achèvement/échec éventuel d'une opération asynchrone et sa valeur résultante.
	 * @param {Number} delay : délai en milisecondes pendant lequel l'exécution doit être suspendue.
	 * @returns : une promesse qui reste en attente jusqu'à ce que delay soit écoulé. Une fois delay écoulé elle sera résolue et toute opération en attente de cette promesse pourra continuer.
	 */
	const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve,delay))

	//-------------------{fonction getPressed}--------------------------

	/**
	 * Fonction qui retourne la valeur de la variable "pressed".
	 * @returns {Number} : la valeur 1 ou 0 en fonction de si la souris est enfoncée ou non. 
	 */
	function getPressed()
	{
		return(pressed);
	}

});

/*
Une ancienne version du Joystick avait été développée à l'aide du projet GitHub suivant : https://github.com/bobboteck/JoyStick .
Il a été supprimé au profit de cette version de Pilotage car certaines directions du joystick (à gauche ou droite) n'étaient pas utiles.
Il nous a semblé intéressant de garder le lien du github si cela pouvait à l'avenir être utile.
*/
