/*
Ce fichier est le javascript des deux pages d'analyse de la calculette LCDM et DE.
Il permet de comparer les calculs effectués par les javascript du site avec ceux d'un autre logiciel afin de confirmer la validité des calculs du site.
*/

function resultatCalculette(fonction_EouF,is_t) { //
    
    log_abs=document.getElementById('check_log_abs').checked;
    log_ord=document.getElementById('check_log_ord').checked;
    //on récupère les variables utiles pour les calcules
    let T0 = Number(document.getElementById("T0").value);
    let H0 = Number(document.getElementById("H0").value);
    let Omega_r0 = Number(document.getElementById("Omégar0").value);//changer
    let Omega_m0 = Number(document.getElementById("Omégam0").value);
    let Omega_k0 = Number(document.getElementById("Omégak0").value);

    if (fonction_EouF.name==="fonction_E"){
        let Omega_l0 = Number(document.getElementById("Omégal0").value);
        text_omegal0_graph ='   \Ω<sub>Λ0</sub>:  '+Omega_l0;
        w0w1="";
        equa_diff_2=equa_diff_2_LCDM;
    }else if (fonction_EouF.name==="fonction_F"){
        let Omega_DE0 = Number(document.getElementById('OmégaDE0').value);
        text_omegal0_graph ='   \Ω<sub>DE0</sub>:  '+Omega_DE0;
        w0w1="  w<sub>0</sub>: "+document.getElementById("w0").value+"  w<sub>1</sub>: "+document.getElementById("w1").value;
        equa_diff_2=equa_diff_2_DE;
    }

    //Si il n'y a pas de big bang impossible a calculer
    if (!debut_fin_univers(equa_diff_2, T0)[5]){
        console.log("ERREUR")
    }
    //paramètre pour le tracer
    let zmin = Number(document.getElementById("graphique_z_min").value);
	let zmax = Number(document.getElementById("graphique_z_max").value);
	let pas = Number(document.getElementById("graphique_pas").value);
    // valeur des abscisses
    let plot_title, xaxis_title, graphdivid, abscisse_calcul, abscisse_display

    if (log_abs){
        fonction_log_lin=log_scale;
    }else if (is_t==0) {
        fonction_log_lin = array_lerp;
    } else {
        fonction_log_lin=linear_scale;
    }


    if (is_t==1){
        sessionStorage.setItem("affichage_d_t","True") 
        plot_title = "d<sub>i</sub>(t)";
        xaxis_title=xaxis_temps;
        graphdivid="graphique_d_t"
        
        if (log_abs){
            abscisse_calcul=fonction_log_lin(zmin,zmax,pas);
            abscisse_display=[];
            abscisse_calcul.forEach(i=>{
                abscisse_display.push(calcul_ages(fonction_EouF,H0_parAnnees(H0),1e-30,1/(1+i)))
            })
        }else{
            let sortieabscisse=abscisse_t(fonction_EouF,zmin,zmax,pas);
            abscisse_calcul=sortieabscisse[0];
            abscisse_display=sortieabscisse[1];
        }
        document.getElementById('graphique_d_t').classList.remove('cache');
    }else{
        sessionStorage.setItem("affichage_d_z","True") 
        plot_title = "d<sub>i</sub>(z)";
        abscisse_calcul = fonction_log_lin(zmin,zmax,pas);
        if (log_abs && zmin < 0) {
            xaxis_title="z+1"
            abscisse_display = []
            abscisse_calcul.forEach(i => {
                abscisse_display.push(i+1)
            })
        } else {
            xaxis_title = "z";
            abscisse_display=abscisse_calcul;
        }    
        graphdivid="graphique_d_z"
        // document.getElementById('check_distance_z').checked=true;
        document.getElementById('graphique_d_z').classList.remove('cache');
    }

    // valeurs des ordonnées
    let dmArr = [];    //distance metrique
    let daArr = [];   //distance diamètre apparent
    let dlArr = [];    //distance luminosité
    let dltArr = [];   //distance temps lumière

    //calculs des longueurs
    abscisse_calcul.forEach(i => {
        let dm
        if (i<0){
            dm=DistanceMetrique(fonction_EouF,i,0,true,1e2);
        }else{
            dm=DistanceMetrique(fonction_EouF,1/(i+1),1,false,1e2);
        }
        let da=dm/(1+i);
        let dl=dm*(1+i);
        let temps = calcul_ages(fonction_EouF,H0_parSecondes(H0),1e-15,1/(1+i));
        let dlt = temps * c;
        dmArr.push(m_vers_AL(dm));
        daArr.push(m_vers_AL(da));
        dlArr.push(m_vers_AL(dl));
        dltArr.push(m_vers_AL(dlt));
    });

    let resultats_dm = dmArr.join(";");
    let resultats_da = daArr.join(";");
    let resultats_dt = dlArr.join(";");
    let resultats_dlt = dltArr.join(";");
    let resultats_abscisse = abscisse_display.join(";");
    
    return resultats_abscisse, resultats_da, resultats_dlt, resultats_dm, resultats_dt;
}


function fonction2() { //à renommer
    let texte = o_recupereJson();
    //à faire
}

function fonction3() { //à renommer
    let texte = o_recupereJson();
    //à faire
}