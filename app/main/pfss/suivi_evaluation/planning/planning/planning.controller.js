(function ()
{
    'use strict';
    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_planning.planning_ddb')
        .controller('PlanningController', PlanningController);

    /** @ngInject */
    function PlanningController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
		var vm = this;
		vm.serveur_central = serveur_central ;    
		vm.all_planning_ddb = [] ;
		vm.planning_ddb_column =[{titre:"Description "},{titre:"Vague "},{titre:"Resp exécution"},{titre:"Resp supervision"},{titre:"Couleur"}];
		// ,{titre:"Affichage"}
		vm.dtOptions_new = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			retrieve:'true',
			order:[] 
		};
	   vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
		// autoWidth: false,
			order: []
		};
		vm.filtre={};
		vm.all_planning=[];
		vm.all_titre_annuel=[];
		vm.all_titre_mensuel=[];
		vm.all_detail_cellule_planning=[];
		vm.all_detail_tableau_valeur_a_afficher=[];
		vm.all_detail_titre_par_cellule=[];
		vm.all_annee =[];
		vm.planning_modifie=false;
		vm.nombre_modification=0;
		vm.code_couleur = [{titre:"Vert foncé",statut:"#31CB17"},{titre:"Vert clair",statut:"#93FF12"},
		{titre:"Jaune",statut:"#FFFF33"},{titre:"Bleu",statut:"#2E76FF"},{titre:"Rouge",statut:"#FF0000"},{titre:"Rouge foncé",statut:"#C6082A"}];
		vm.affiche_creation = false ;
		apiFactory.getAPIgeneraliserREST("planning_general/index","liste_annee",1).then(function(result){
			vm.all_annee = result.data.response;
		});    
		
		vm.formatMillier = function (nombre) {
			if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
				nombre += '';
				var sep = ' ';
				var reg = /(\d+)(\d{3})/;
				while (reg.test(nombre)) {
					nombre = nombre.replace(reg, '$1' + sep + '$2');
				}
				return nombre;
			} else {
				return "";
			}
		}
		vm.affiche_reponse = function(parametre) {
			if(parametre==0) {
				return "Non";
			} else if(parametre==1){
				return "Oui";
			} else {
				return "";
			}
        };
      vm.code_couleur = [{valeur_affiche:"Rouge",valeur:"#FF0000"},{valeur_affiche:"Rouge foncé",valeur:"#C6082A"},
	  {valeur_affiche:"Bleu",valeur:"#2E76FF"},{valeur_affiche:"Vert clair",valeur:"#93FF12"},
	  {valeur_affiche:"Vert foncé",valeur:"#31CB17"},{valeur_affiche:"Jaune",valeur:"#FFFF33"}];
		vm.affiche_couleur = function(couleur) {
			switch (couleur) {
				case '#FF0000':
					return 'Rouge';
					break;
				case '#C6082A':
					return 'Rouge foncé';
					break;
				case '#2E76FF':
					return 'Bleu';
					break;
				case '#93FF12':
					return 'Vert clair';
					break;
				case '#31CB17':
					return 'Vert foncé';
					break;
				case '#FFFF33':
					return 'Jaune';
					break;
				default:
					return '';
					break;
			}		
			if(parametre==0) {
				return "Non";
			} else if(parametre==1){
				return "Oui";
			} else {
				return "";
			}
        };
		vm.modifier_planning=function() {
			vm.planning_modifie=true;
		}
        vm.enregistrer_planning = function(etat_suppression)  {
			vm.affiche_enregistrer = true ;
          var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };
                var datas = $.param({                 
                    annee_debut:vm.filtre.annee_debut,
                    annee_fin:vm.filtre.annee_fin,
					all_planning: JSON.stringify(vm.all_planning),      
               });
                apiFactory.add("planning_general/index",datas, config).success(function (data)  {
					vm.msg="Mise à jour planning réussi, Merci !";
					vm.showAlert("Information",vm.msg);
					vm.planning_modifie=false;
					vm.affiche_enregistrer = false ;
					vm.nombre_modification=0;
				})
				.error(function (data) {alert("Une erreur s'est produit");}); 
        }
        vm.creer_planning = function()  {
          vm.affiche_creation = true ;
          var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };
                var datas = $.param({                 
                    creation:1,
                    annee_debut:vm.filtre.annee_debut,                 
                    annee_fin : vm.filtre.annee_debut ,
                });
                apiFactory.add("planning_general/index",datas, config).success(function (data)  {
					vm.msg="Création planning réussi, Merci !";
					console.log(data.response)
					vm.showAlert("Information",vm.msg);
					vm.affiche_creation = false ;
				})
				.error(function (data) {alert("Une erreur s'est produit");}); 
        }
		vm.filtrer = function()	{
			vm.nombre_modification=0;
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("planning_general/index","planning",1,"annee_debut",vm.filtre.annee_fin,"annee_fin",vm.filtre.annee_fin).then(function(result) { 
				vm.all_titre_annuel=[];
				vm.all_titre_mensuel=[];
				vm.all_detail_cellule_planning=[];
				vm.all_detail_tableau_valeur_a_afficher=[];
				vm.all_detail_titre_par_cellule=[];
				
				vm.all_planning = result.data.response;   
				var msg ="Aucun planning trouvé pour le filtre spécifié. Merci ! ";	
				if(result.data.response.length==0) {
					vm.showAlert("INFORMATION",msg);
				} else {
					vm.all_titre_annuel=vm.all_planning[0].detail_titre_annuel;
					vm.all_titre_mensuel=vm.all_planning[0].detail_titre_mensuel;
					vm.all_detail_cellule_planning=vm.all_planning[0].detail_cellule_planning;
					vm.all_detail_tableau_valeur_a_afficher=vm.all_planning[0].detail_tableau_valeur_a_afficher;	
					vm.all_detail_titre_par_cellule=vm.all_planning[0].detail_titre_par_cellule;	
				}	
				
				vm.affiche_load = false ;
			});
		}
		vm.showAlert = function(titre,textcontent) {         
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(textcontent)
            .ariaLabel('Information')
            .ok('Fermer')
            .targetEvent()
          );
        } 
		vm.click_cellule_planning=function(index_enregistrement_principal,index_detail_valeur_affichee,valeur_actuelle) {
			if(vm.planning_modifie==true) {
				// Lors de la sauvegarde : on utilise seulement les tableaux de
				// detail_cellule_planning pour avoir la colonne à mettre à jour de la forme S6_4X25000 veut dire 
				// la colonne S6_4 séparé par le caractere X et avec id=25000 dans la table et à décortiquer avant sauvegarde (substr)
				// et detail_valeur_planning qui stocke les valeurs 1 ou 0 (selectionné ou non)
				// en combinant les 2 tableaux et en utlisant l'index de valeur des 2
				// décommenter les commentaires console.log pour savoir les colonnes et valeurs à mettre à jour
				// en utilisant le tableau detail_cellule_planning les colonnes dans la base de données sont representés comme suit
				// S1_1 à S12_4 : 
				// S1_1 veut dire mois de janvier (1) premiere semaine (1) 
				// et S12_4 veut dire mois de décembre (12) semaine 4 (4)
				// et S4_2X78 veut dire mois d'avril deuxieme semaine ET id 78 dans la BDD table planning_general 
				// à décortiquer lors de la sauvegarde	
				// ratsy ny ady a 5 andro tsy natory vao hita io a
				vm.nombre_modification=vm.nombre_modification +1;	
				// var msg = "index ppal = " + index_enregistrement_principal + " index secondaire = " + index_detail_valeur_affichee +" valeur actuelle = " + valeur_actuelle;
				// console.log(msg);
				
				if(parseInt(valeur_actuelle)==0) {
					vm.valeur_en_cours=String(1);
				} else {
					vm.valeur_en_cours=String(0);
				}
				////////////////////////////////////////////////////////////////	
				vm.all_planning[index_enregistrement_principal].detail_valeur_planning[index_detail_valeur_affichee].valeur=vm.valeur_en_cours;
				////////////////////////////////////////////////////////////////
				
				// vm.qui= vm.all_planning[index_enregistrement_principal].detail_cellule_planning[index_detail_valeur_affichee];
				// console.log(vm.all_planning[index_enregistrement_principal].detail_cellule_planning);
				console.log(vm.all_planning);
				console.log(vm.all_planning[index_enregistrement_principal].detail_valeur_planning);
				// console.log(vm.qui);
			}	
		}
    }
})();
