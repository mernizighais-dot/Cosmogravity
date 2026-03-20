/**
 * Fonction qui crée le graphe du potentiel à chaque fois qu'elle est appelée,
 pour pouvoir adapter la particule et le potentiel à la position acutelle
 * @param {*} Onresize : si on veut changer de zoom.
 * @param {*} data1 : liste qui contient la gamme qu'on doit dessiner.
 * @param {*} data2  : liste qui contient les valeurs à dessiner.
 * @param {*} compteur : pour savoir quel mobile c'est.
 * @param {*} mobile  : le mobile pour lequel on trace le potentiel.
 * @returns 
 */
function graphique_creation_pot(Onresize=0,data1,data2,compteur,mobile) 
{
  //on verifie que les données existent 
  if(data2 !== undefined && data1 !== undefined && data2[0]!==undefined)
  {
    var texte = o_recupereJson(); // on recupere le texte du json

    /*POUR KERR (un seul mobile)*/
     
    titre = texte.pages_trajectoire.titre_graphe;//représente le titre du graphe
    graphe_svg = "#grsvg_2";//représente l'identifiant SVG où le graphe sera affiché
    graphe_point = "line-point"; // graphe_point indique le type de représentation graphique, ici "line-point"

    /*POUR SCH (plusieurs mobiles)*/
    if(mobile!=null)
    {
      titre = titre+" "+ compteur.toString() ; //représente le titre du graphe 
      graphe_svg=mobile.graphesvg;   //représente l'identifiant SVG où le graphe sera affiché
      graphe_point=mobile.pointsvg;      // graphe_point indique le type de représentation graphique, ici "line-point"
      
    }

    //on met une liste pour les margin (espace à laisser autour du graphe)
    var margin = 
    {
      top: 30,
      right: 10,
      bottom: 50,
      left: 80
    };

    taille_carac = 14; //taille des caracteres

  
    width = 370 ; // on definit la largeur
    height = 300 ; // on definit la hauteur

    /* DÉFINITION DES ÉCHELLES POUR L'AXE X ET L'AXE Y */

    // Échelle pour l'axe x : 
    // Domaine basé sur les dates de data1 (valeurs minimale et maximale)
    // Plage allant de 0 (gauche du graphique) à width (droite du graphique)
    x = d3.scale.linear()
          .domain(d3.extent(data1, function(d) { return d.date; }))
          .range([0, width]);

    // Échelle pour l'axe y : 
    // Domaine basé sur les valeurs de clôture (close) de data1 (valeurs minimale et maximale)
    // Plage allant de height (bas du graphique) à 0 (haut du graphique)
    y = d3.scale.linear()
          .domain(d3.extent(data1, function(d) { return d.close; }))
          .range([height, 0]);

    /* DÉFINITION DE LA FONCTION VALUELINE POUR DESSINER UNE LIGNE */

    // Utilisation de d3.svg.line() pour créer une ligne SVG
    var valueline = d3.svg.line()
    .x(function(d) 
    {
      // Fonction pour retourner la position x en fonction de la valeur de date de chaque point de données (d)
      return x(d.date);
    })
    .y(function(d) 
    {
      // Fonction pour retourner la position y en fonction de la valeur de clôture (close) de chaque point de données (d)
      return y(d.close);
    });


    
    // Sélectionne l'élément SVG sur lequel le graphe sera dessiné et le stocke dans une variable
    var svg = d3.select(graphe_svg)
      // Définit la largeur de l'élément SVG en ajoutant les marges gauche et droite
      .attr("width", width + margin.left + margin.right)
      // Définit la hauteur de l'élément SVG en ajoutant les marges supérieure et inférieure
      .attr("height", height + margin.top + margin.bottom)
      // Ajoute un groupe (`g`) au SVG et le déplace selon les marges
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    /*AXES */
  
    //on definit les axes X et Y
    var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5).tickFormat(d3.format(".1e"));//x

    var yAxis = d3.svg.axis().scale(y)  
      .orient("left").ticks(5).tickFormat(d3.format(".1e")); //y

    // Ajouter l'axe X
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)    //on appele l'axe qu'on a definit
    .style("font-size", ""+ taille_carac+"px")//on choisit la taille de la police
    .selectAll("path, line")  //on dit que c'est une ligne qu'on veut dessiner
    .style("stroke", "#000000")  //on la dessine avec du noir
    .style("stroke-width", "1px"); // Applique l'épaisseur de trait aux lignes et au chemin de l'axe X


    // Ajouter l'axe Y avec les memes etapes
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .style("font-size", ""+ taille_carac+"px")
    .selectAll("path, line")
    .style("stroke", "#000000") 
    .style("stroke-width", "1px"); // Applique l'épaisseur de trait aux lignes et au chemin de l'axe X

    
    // Ajouter un trait vertical dans le graphique
    svg.append("line")
       .attr("class", "vertical-line")
       .attr("x1", width)  // Coordonnée x du trait
       .attr("y1", 0)    // Coordonnée y de départ du trait
       .attr("x2", width)  // Coordonnée x de fin du trait (même que x1 pour un trait vertical)
       .attr("y2", height) // Coordonnée y de fin du trait
       .style("stroke", "#000000") // Couleur noire en hexadécimal
       .style("stroke-width", "1px");

    // Ajouter un trait horizontal dans le graphique
    svg.append("line")
       .attr("class", "horizontal-line")
       .attr("x1", 0)           // Coordonnée x de départ du trait (à gauche du graphique)
       .attr("y1", height*0.0001)      // Coordonnée y de départ du trait (au bas du graphique)
       .attr("x2", width)       // Coordonnée x de fin du trait (à droite du graphique)
       .attr("y2", height*0.0001)      // Coordonnée y de fin du trait (au même niveau que y1 pour un trait horizontal)
       .style("stroke", "#000000")    // Couleur noire en hexadécimal
       .style("stroke-width", "1px"); // Epaisseur du trait

    /*LA GILLE */
    //grille en x
    svg.selectAll("line.x")
       .data(x.ticks(5))
       .enter().append("line")
       .attr("class", "x")
       .attr("x1", x)
       .attr("x2", x)
       .attr("y1", 0)
       .attr("y2", height)
       .style("stroke", "#ccc");
        
  //grille en y
  svg.selectAll("line.y")
      .data(y.ticks(5))
      .enter().append("line")
      .attr("class", "y")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y)
      .attr("y2", y)
      .style("stroke", "#ccc");

    /*DESSIN DES POINTS SUR LE POTENTIEL*/
    svg.selectAll("dot")
      .data(data1)
      .enter().append("circle")
      .attr("r", 1.3)
      .attr("cx", function (d) { return x(d.date); })
      .attr("cy", function (d) { return y(d.close); })
      .attr("class", graphe_point);

    /*LEGENDE*/
    //Le titre
    // Ajoute un élément <text> à l'élément SVG existant
    svg.append("text")
    // Attribue la classe "legend_titre" à cet élément <text> pour faciliter le style CSS
      .attr("class", "legend_titre")
    // Positionne l'élément <text> sur l'axe x, centré horizontalement avec un décalage de 120 unités vers la gauche
      .attr("x", width / 2 - 120)
    // Positionne l'élément <text> sur l'axe y, avec un décalage vers le haut basé sur la marge supérieure et 5 unités supplémentaires
      .attr("y", -margin.top / 2 - 5)
    // Ajoute un décalage vertical pour l'alignement du texte, ici 0.3em
      .attr("dy", ".3em")
    // Applique une transformation de rotation de 0 degrés, ce qui signifie que le texte reste horizontal
      .attr("transform", "rotate(0)")
    // Définit la taille de la police en fonction de la variable 'taille_carac', multipliée par 1.5
      .style("font-size", "" + taille_carac * 1.5 + "px")
    // Définit le texte affiché par l'élément <text> en utilisant la variable 'titre'
    .text(titre);

    //text pour l'axe des x avec les memes etapes
    svg.append("text")
      .attr("class", "legend_axe")
      .attr("x", width / 2 -30)
      .attr("y", height + margin.top / 0.75)
      .attr("dy", ".3em")
      .attr("transform", "rotate(0)")
      .style("font-size", "" + taille_carac + "px")
      .text("r (m)");

    //text pour l'axe des y avec les memes etapes
    svg.append("text") 
      .attr("class", "legend_axe") 
      .attr("x", -height / 2  )
      .attr("y", -margin.left*0.85- 5 )
      .attr("dy", ".3em")
      .attr("transform", "rotate(-90)")
      .style("font-size", "" + taille_carac + "px")
      .text(title);

    /*DESSIN DE LA FONCTION POTENTIEL*/
    // Ajoute un élément <path> à l'élément SVG existant
    svg.append("path")
      .attr("class", "line")// Attribue la classe "line" à cet élément <path> pour faciliter le style CSS
    // Définit l'attribut 'd' du <path> en utilisant la fonction valueline(data1)
    // La fonction valueline génère les commandes de dessin basées sur les données de data1
      .attr("d", valueline(data1))
    // Définit la couleur de la ligne à 'steelblue'
      .attr('stroke', 'steelblue')
    // Définit l'épaisseur de la ligne à 2 pixels
     .attr('stroke-width', 2)
    // Définit le remplissage de la forme à 'none' pour que l'intérieur du chemin ne soit pas rempli
      .attr('fill', 'none');


    point = svg.append("g")
      .attr("class", graphe_point);

    /*DESSIN DE LA BOULE ROUGE*/
    point.selectAll('circle') //on met que c'est un cercle 
      .data(data2)//on met les coordonées
      .enter().append('circle')//on ajoute le cercle
      .attr("cx", x(data2[0].date)) //on choisi les coordonnées en x
      .attr("cy", y(data2[0].close))//on choisi les coordonnées en y
      .attr("r", 5)//on met le rayon de la boule 
      .style("fill", "#FF001A") //on remplit avec de la couleur rouge
      .attr('stroke', '#FF001A'); //on dessine les bords avec du rouge

  }
  // Condition ajoutée pour SCH (plusieurs mobiles)
  if (mobile != null) {
    // Si l'objet mobile existe, assigne les valeurs point, x et y à ses propriétés point et blups
    mobile.point = [point, x, y];
    mobile.blups = 1;
  }

  // Retourne un tableau contenant les valeurs point, x et y
  return [point, x, y];

}


