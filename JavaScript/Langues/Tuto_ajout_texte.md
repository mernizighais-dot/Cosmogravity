# Ajouter du texte sur une des pages html

1.  Créez votre élément html, donnez lui un attribut id="<id de l'élément>" et ne mettez rien dedans.
2.  Ouvrez le fichier gestion_langues.js et trouvez la fonction texte_xxx correspondant à la page HTML ou vous voulez ajouter du texte
3.  Dans cette fonction ajoutez un : <br />
    document.getElementById("<id de l'élément>").innerHTML = texte.\<page>.\<tag>; <br />
    La page qui vous intéresse peut se trouve dans les fichier .json et devraient être assez reconaissable. <br />
    Veillez à bien choisir le tag pour qu'il ne soit pas trop différent de l'ID de l'élément et reconaissable.
4.  Ouvrez les fichiers fr.json et en.json, allez dans la page correspondante (première indentation) et ajoutez au niveau
    de la deuxième indentation: <br />
    "\<tag>": "\<texte français ou anglais>" <br />
    Il est important d'ajouter cette ligne dans les 2 json au même niveau d'indentation sinon le texte ne fonctionnera
    pas en anglais ET en français.

# Notes
Il est possible de changer l'\<attribut> d'un element en utilisant :
- document.getElementById("<id de l'élément>").\<attribut> = texte.\<page>.\<tag>;

Ainsi, il est possible de changer une image / infobulle en fonction de la langue. <br />
<br />
Si vous souhaitez générer du texte avec un fichier javascript, vous pouvez directement utiliser la fonction
texte = o_recupereJson() et utiliser le getElement dans la foulée mais vous devez suivre la première étape.