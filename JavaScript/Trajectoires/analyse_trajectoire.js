import { lancerDeFusees as lancement_traj_inter_photon} from "./JavaScript/Trajectoires/calcul_trajectoire_inter_photon.js";
import { lancerDeFusees as lancement_traj_inter} from "./JavaScript/Trajectoires/calcul_trajectoire_inter.js";
import { trajectoire as lancement_traj_kerr_photon} from "./JavaScript/Trajectoires/calcul_trajectoire_kerr_photons.js";
import { trajectoire as lancement_traj_kerr} from "./JavaScript/Trajectoires/calcul_trajectoire_kerr.js";
import { lancerDeFusees as lancement_traj_photon} from "./JavaScript/Trajectoires/calcul_trajectoire_photons.js";
import { lancerDeFusees as lancement_traj} from "./JavaScript/Trajectoires/calcul_trajectoire.js";

async function attendre(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function analyse_trajectoire(mode) {

    let rayon, vitesse_radiale, vitesse_tangentielle, L, E;
    let data = "rayon,vitesse_radiale,vitesse_tangentielle,L,E\n";
    let analyse_trajectoire_en_cours = true;

    document.getElementById("pause/resume").addEventListener("click", () => 
	{
        analyse_trajectoire_en_cours = !analyse_trajectoire_en_cours;
	}); 

    while(analyse_trajectoire_en_cours) {

        if (mode == "traj_inter_photon") {
            rayon = document.getElementById("r_par").innerHTML;
            vitesse_radiale = document.getElementById("vr_sc_mas").innerHTML;
            vitesse_tangentielle = document.getElementById("vp_sc_mas").innerHTML;
            L = document.getElementById("L1").innerHTML;
            E = document.getElementById("E1").innerHTML;
        }
        else if (mode == "traj_inter") {
            rayon = document.getElementById("r_par").innerHTML;
            vitesse_radiale = document.getElementById("vr_sc_mas").innerHTML;
            vitesse_tangentielle = document.getElementById("vp_sc_mas").innerHTML;
            L = document.getElementById("L1").innerHTML;
            E = document.getElementById("E1").innerHTML;
        }
        else if (mode == "traj_kerr_photon") {
            rayon = document.getElementById("r_par").innerHTML;
            vitesse_radiale = document.getElementById("vrkp").innerHTML;
            vitesse_tangentielle = document.getElementById("vpkp").innerHTML;
            L = document.getElementById("L").innerHTML;
            E = document.getElementById("E").innerHTML;
        }
        else if (mode == "traj_kerr") {
            rayon = document.getElementById("r_par").innerHTML;
            vitesse_radiale = document.getElementById("vrkp").innerHTML;
            vitesse_tangentielle = document.getElementById("vpkp").innerHTML;
            L = document.getElementById("L").innerHTML;
            E = document.getElementById("E").innerHTML;
        }   
        else if (mode == "traj_photon") {
            rayon = document.getElementById("r_par").innerHTML;
            vitesse_radiale = document.getElementById("vr_sc_mas").innerHTML;
            vitesse_tangentielle = document.getElementById("vp_sc_mas").innerHTML;
            L = document.getElementById("L1").innerHTML;
            E = document.getElementById("E1").innerHTML;
        }
        else if (mode == "traj") {
            rayon = document.getElementById("r_par").innerHTML;
            vitesse_radiale = document.getElementById("vr_sc_mas").innerHTML;
            vitesse_tangentielle = document.getElementById("vp_sc_mas").innerHTML;
            L = document.getElementById("L1").innerHTML;
            E = document.getElementById("E1").innerHTML;
        }

        data += `${rayon},${vitesse_radiale},${vitesse_tangentielle},${L},${E}\n`;
        await attendre(100); //temps en ms entre chaque ligne de données (ici 100ms)

    }

    download_csv(data, "analyse_trajectoire.csv");
    
}

async function lancement_analyse() {

    let traj_inter_photon = document.getElementById("check_traj_inter_photon").checked;
    let traj_inter = document.getElementById("check_traj_inter").checked;
    let traj_kerr_photon = document.getElementById("check_traj_kerr_photon").checked;
    let traj_kerr = document.getElementById("check_traj_kerr").checked;
    let traj_photon = document.getElementById("check_traj_photon").checked;
    let traj = document.getElementById("check_traj").checked;

    if (traj_inter_photon) {
        lancement_traj_inter_photon(1);
        await attendre(100);
        analyse_trajectoire("traj_inter_photon"); 
    }
    else if (traj_inter) {
        lancement_traj_inter(1);
        await attendre(100);
        analyse_trajectoire("traj_inter");
    }   
    else if (traj_kerr_photon) {
        lancement_traj_kerr_photon();
        await attendre(100);
        analyse_trajectoire("traj_kerr_photon");  
    }
    else if (traj_kerr) {
        lancement_traj_kerr();
        await attendre(100);
        analyse_trajectoire("traj_kerr");    
    }
    else if (traj_photon) {
        lancement_traj_photon(1);
        await attendre(100);
        analyse_trajectoire("traj_photon");
    }
    else if (traj) {
        lancement_traj(1);
        await attendre(100);
        analyse_trajectoire("traj");
    }
}

function download_csv(data, filename) {

    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
        
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
        
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}