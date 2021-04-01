(function ()
{
    'use strict';

    angular
        .module('fuse')
        .factory('apiFactory', apiFactory)
        .factory('cookieService', cookieService)
        .factory('storageService', storageService)
        .factory('hashage', hashage)
        .factory('loginService', loginService);


    /** @ngInject */
    function apiFactory($http, apiUrl){
        return{
          getAll: function(controller) {
            return $http.get(apiUrl+controller);
          },
          getOne: function(controller, id) {
            return $http.get(apiUrl+controller+"?id="+id);
          },
          add: function(controller, data, config) {
            return $http.post(apiUrl+controller, data, config);
          },
          getUserByEnabled: function(controller, enabled) {
            return $http.get(apiUrl+controller+"?enabled="+enabled);
          },
          getAPIgeneraliser: function(controller,champ1,valeur1,champ2,valeur2) {
            return $http.get(apiUrl+controller+"?"+champ1+"="+valeur1+"&"+champ2+"="+valeur2);
          },
          getAPIgeneraliserCI: function(controller,valeur1,valeur2,valeur3) {
            return $http.get(apiUrl+controller+"/"+valeur1+"/"+valeur2+"/"+valeur3);
          },
          getAPIgeneraliserREST: function(controller,champ1,valeur1,champ2,valeur2,champ3,valeur3,champ4,valeur4,champ5,valeur5,champ6,valeur6,champ7,valeur7,champ8,valeur8,champ9,valeur9,champ10,valeur10) {
            return $http.get(apiUrl+controller+"?"+champ1+"="+valeur1+"&"+champ2+"="+valeur2+"&"+champ3+"="+valeur3+"&"+champ4+"="+valeur4+"&"+champ5+"="+valeur5+"&"+champ6+"="+valeur6+"&"+champ7+"="+valeur7+"&"+champ8+"="+valeur8+"&"+champ9+"="+valeur9+"&"+champ10+"="+valeur10);
          },
          getAllNonFait: function(model,fait) {//DP
            return $http.get(apiUrl+model+"?fait='"+fait+"'");
          },
          getTable: function(controller, nom_table) {
            return $http.get(apiUrl+controller+"?nom_table="+nom_table);
          },
          getVillageByIle: function(controller, id) {
            return $http.get(apiUrl+controller+"?ile_id="+id);
          },
          getPrefectureByIle: function(controller, id) {
            return $http.get(apiUrl+controller+"?ile_id="+id);
          },
          getCommuneByPrefecture: function(controller, id) {
            return $http.get(apiUrl+controller+"?region_id="+id);
          },
          getVillageByCommune: function(controller, id) {
            return $http.get(apiUrl+controller+"?cle_etrangere="+id);
          },
          delete_ddb:function(controller, table) {
            return $http.post(apiUrl+controller+"?nom_table="+table);
          },
          getAll_serveur_central: function(controller, table) {
            return $http.get(apiUrl_serve_central+controller+"?nom_table="+table);
          },
          getAll_acteur_serveur_central: function(controller) {
            return $http.get(apiUrl_serve_central+controller);
          },
          getParamsDynamic : function(controller) {
            return $http.get(apiUrl+controller);
          },
          add_serveur_central: function(controller, data, config) {
            return $http.post(apiUrl_serve_central+controller, data, config);
          }




        };
    }

    /** @ngInject */
    function cookieService($cookieStore) {
      return {
        set: function (key, value) {
          return $cookieStore.put(key, value);
        },
        get: function (value) {
          return $cookieStore.get(value);
        },
        del: function (value) {
          return $cookieStore.remove(value);
        }
      };
    };

    /** @ngInject */
    function storageService($http) {
      return {
        set: function (key, value) {
          return localStorage.setItem(key, value);
        },
        get: function (value) {
          return localStorage.getItem(value);
        },
        del: function (value) {
          return localStorage.removeItem(value);
        }
      };
    };

    /** @ngInject */
    function loginService($http, apiUrl, $location, cookieService, storageService, $mdDialog, $state,$window,hashage)
    {
      return{
        sing_in: function(utilisateur, ev){
          //clear
          cookieService.del('id');
          cookieService.del('nom');
          cookieService.del('prenom');
          cookieService.del('email');
          cookieService.del('token');
          cookieService.del('site');
          cookieService.del('roles');
          cookieService.del('exist');
          storageService.del('exist');
          storageService.del('enabled');
          //
          var email = utilisateur.email;
          var pwd = hashage.sha1(utilisateur.password);
          //CONNEXION A L'APPLICATION
          //$location.path("/accueil");//esorina rehefa vita ny connexion,any @index.run mbola misy
          $http.get(apiUrl+'utilisateurs?email='+email+'&pwd='+pwd)
            .success(function(data){
              if(data.status == true)
                  {
                    cookieService.set('id',data.response.id);
                    cookieService.set('nom',data.response.nom);
                    cookieService.set('prenom',data.response.prenom);
                    cookieService.set('email',data.response.email);
                    cookieService.set('token',data.response.token);
                    cookieService.set('site',data.response.site_id);
                    cookieService.set('roles',data.response.roles);
                    storageService.set('exist',9);
                    storageService.set('enabled',data.response.enabled);
                    if(data.response.enabled==0)
                    {
                      $location.path("/auth/lock");
                    }
                    else
                    {
                      location.reload();

                 // $location.path("/accueil");//si n'est pas packeT
                  
                      $window.location.href = '/MIS';
                    }
                  }else{

                    $mdDialog.show({
                      controller         : function ($scope, $mdDialog)
                      {
                        $scope.closeDialog = function ()
                        {
                          $mdDialog.hide();
                        }
                      },
                      template           : '<md-dialog>' +
                      '  <md-dialog-content><h1 class="md-warn-fg" translate="LOGIN.error.titre">titre</h1><div><pre translate="LOGIN.error.msg">corps</pre></div></md-dialog-content>' +
                      '  <md-dialog-actions>' +
                      '    <md-button ng-click="closeDialog()" class="md-primary" translate="LOGIN.error.quitter">' +
                      '      Quitter' +
                      '    </md-button>' +
                      '  </md-dialog-actions>' +
                      '</md-dialog>',
                      parent             : angular.element('body'),
                      targetEvent        : ev,
                      clickOutsideToClose: true
                    });
                    cookieService.del('id');
                    cookieService.del('nom');
                    cookieService.del('prenom');
                    cookieService.del('email');
                    cookieService.del('token');
                    cookieService.del('site');
                    cookieService.del('roles');
                    cookieService.del('exist');
                    storageService.del('exist');
                    storageService.del('enabled');
                    $location.path("/auth/login");
                  }
            });
        },
        logout: function(){
          cookieService.del('id');
          cookieService.del('nom');
          cookieService.del('prenom');
          cookieService.del('email');
          cookieService.del('token');
          cookieService.del('site');
          cookieService.del('roles');
          cookieService.del('exist');
          storageService.del('exist');
          storageService.del('enabled');
          $location.path("/auth/login");
        },
        isEnabled: function(){
          var token = cookieService.get('token');
          var enabled = storageService.get('enabled');
          if(token && enabled == 1){return true;}else{return false;}
        },
        isPermitted: function(AllPermitted,Permitted){
          var tab = [];
          $.each(AllPermitted,function(All) {
            $.each(Permitted,function(One) {
              if(AllPermitted[All] == Permitted[One])
              {
                tab.push(1);
              }
            });
          });
          if(tab.length > 0 ){
            return true;
          }else{
            return false;
          }
        },
        gestionMenu:function(listesAutorise, autorisationPersonnel)
        {
            var tab = [];
            angular.forEach(listesAutorise, function(value, key)
            {
                angular.forEach(autorisationPersonnel, function(val, k)
                {
                
                    if (value == val) 
                    {
                       tab.push(1);


                    };


                });
            });
            if(tab.length > 0 )
            {
              return false;
            }else{
              return true;
            }
        }
      };
    }

    function hashage()
    {
      return{
        //sha1 hash
      /**
        * Secure Hash Algorithm (SHA1)
        * http://www.webtoolkit.info/
        **/
        sha1 : function SHA1(msg) {
         function rotate_left(n,s) {
         var t4 = ( n<<s ) | (n>>>(32-s));
         return t4;
         };
         function lsb_hex(val) {
         var str='';
         var i;
         var vh;
         var vl;
         for( i=0; i<=6; i+=2 ) {
         vh = (val>>>(i*4+4))&0x0f;
         vl = (val>>>(i*4))&0x0f;
         str += vh.toString(16) + vl.toString(16);
         }
         return str;
         };
         function cvt_hex(val) {
         var str='';
         var i;
         var v;
         for( i=7; i>=0; i-- ) {
         v = (val>>>(i*4))&0x0f;
         str += v.toString(16);
         }
         return str;
         };
         function Utf8Encode(string) {
         string = string.replace(/\r\n/g,'\n');
         var utftext = '';
         for (var n = 0; n < string.length; n++) {
         var c = string.charCodeAt(n);
         if (c < 128) {
         utftext += String.fromCharCode(c);
         }
         else if((c > 127) && (c < 2048)) {
         utftext += String.fromCharCode((c >> 6) | 192);
         utftext += String.fromCharCode((c & 63) | 128);
         }
         else {
         utftext += String.fromCharCode((c >> 12) | 224);
         utftext += String.fromCharCode(((c >> 6) & 63) | 128);
         utftext += String.fromCharCode((c & 63) | 128);
         }
         }
         return utftext;
         };
         var blockstart;
         var i, j;
         var W = new Array(80);
         var H0 = 0x67452301;
         var H1 = 0xEFCDAB89;
         var H2 = 0x98BADCFE;
         var H3 = 0x10325476;
         var H4 = 0xC3D2E1F0;
         var A, B, C, D, E;
         var temp;
         msg = Utf8Encode(msg);
         var msg_len = msg.length;
         var word_array = new Array();
         for( i=0; i<msg_len-3; i+=4 ) {
         j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
         msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
         word_array.push( j );
         }
         switch( msg_len % 4 ) {
         case 0:
         i = 0x080000000;
         break;
         case 1:
         i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
         break;
         case 2:
         i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
         break;
         case 3:
         i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8 | 0x80;
         break;
         }
         word_array.push( i );
         while( (word_array.length % 16) != 14 ) word_array.push( 0 );
         word_array.push( msg_len>>>29 );
         word_array.push( (msg_len<<3)&0x0ffffffff );
         for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
         for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
         for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
         A = H0;
         B = H1;
         C = H2;
         D = H3;
         E = H4;
         for( i= 0; i<=19; i++ ) {
         temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
         }
         for( i=20; i<=39; i++ ) {
         temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
         }
         for( i=40; i<=59; i++ ) {
         temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
         }
         for( i=60; i<=79; i++ ) {
         temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
         }
         H0 = (H0 + A) & 0x0ffffffff;
         H1 = (H1 + B) & 0x0ffffffff;
         H2 = (H2 + C) & 0x0ffffffff;
         H3 = (H3 + D) & 0x0ffffffff;
         H4 = (H4 + E) & 0x0ffffffff;
         }
         var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

         return temp.toLowerCase();
        }
    //fin sha1 hash
      };
    };

    

})();
