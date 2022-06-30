$(document).ready(function() {
    $.cookie.defaults = { path: '/' };
    var Timer = 0;
    var window_focus;
    var WindowTick = 60 * 1000; // every 60 seconds
    var WindowAwayTimer = 0;
    var WindowTarget = rand(4,6);		// 10s x 6 = 1min x 4;

    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
    var URL = url.split("/");
    var isUserPage;

    // OVERRIDES
    if(URL[2] == "s") {
        WindowTick = 5 * 1000;
    }

    // DASHBOARD STUFF
    Highcharts.setOptions({
        global: {
            useUTC: true
        },
        lang: {
            thousandsSep: ','
        },
        credits: {
            enabled: false
        }
    });

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-left",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "15000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }	
	
    // Facebook hashbang redirect
    if (window.location.hash == '#_=_'){
        history.replaceState 
            ? history.replaceState(null, null, window.location.href.split('#')[0])
            : window.location.hash = '';
    }

	
    // DISCORD PARTNERS
    $("#discord-footer-options").click(function() {
        $("#discord-footer-partners").hide(100);
        $.post( "/js/class/partners/discord-footer-button-close", { enable:1 }, function( data ) {});
    });
    
    $("#notification_overlay").click(function(event) {
        var isVisible = $("#notification_overlay").is(':visible');

        if (isVisible === true) {
            $(".notification_box").hide();
            $("#notification_overlay").hide();
        }        
        
    });
    
    
     $("#popup_overlay").click(function(event) {
        var isVisible = $("#popup_overlay").is(':visible');

        if (isVisible === true) {
	    $("[data-type='popup']").hide();
            $("#popup_overlay").hide();
	    
	    // DAILY MOTION USER VIDEOS
	    if(URL[1] == "dailymotion" && URL[2] == "user") {
		$("#dm-video-embed").remove();
	    }
        }        
        
    });
    
	
	// HOMEPAGE META SEARCH
	$("#homepage-meta-search-button").click(function(event) {
		var querylength = $("#homepage-meta-search-input").val().length;
		if(querylength > 1) {
			var querystring = $("#homepage-meta-search-input").val();
			window.location = "/search/"+querystring;
		}
	});
	
	$('#homepage-meta-search-input').keyup(function(event){
		if(event.keyCode == 13) {
			var querylength = $("#homepage-meta-search-input").val().length;
			if(querylength > 1) {
				var querystring = $("#homepage-meta-search-input").val();
				window.location = "/search/"+querystring;
			}
		}
	});	
	
	// REFRESH TIMER
        (function(){ if($('#ChatInfo').length <= 0) {
                if (window.location.protocol !== 'https:') { var jsonURL = "http://ring.socialblade.com/ding.json"; } else if (window.location.protocol !== 'http:') { var jsonURL = "https://ring.socialblade.com/ding.json"; } else { var jsonURL = "http://ring.socialblade.com/ding.json"; }

                if(document.hasFocus())
                    WindowAwayTimer=0;
                else
                    WindowAwayTimer++;

                setTimeout(arguments.callee, WindowTick);
                if(WindowAwayTimer >= WindowTarget) {
                
                    $.getJSON(jsonURL, function( data ) {
                        if(document.hasFocus()) {
                            WindowAwayTimer = 0;
                        } else {
                            if(data["ping"] == 1) {
                                WindowAwayTimer = 0;
                                location.reload();
                            }
                        }
                    });
                }
            }
	})();

    // Authenticated Members - Remove Auth Token from User
    if(URL[1] == "authenticate" && URL[3] == "members") {
        
        $("i[data-class='circle-auth-check']")
            .mouseover(function() {
                $(this).css('color', '#cc4545');
                $(this).removeClass('fa-check-circle').addClass('fa-times-circle');
            })
            .mouseout(function() {
                $(this).css('color', '#52b9ff');
                $(this).removeClass('fa-times-circle').addClass('fa-check-circle');
            });
        
        $("i[data-class='circle-auth-check']").click(function(event) {
            event.preventDefault();
            
            // data members
            var _id = $(this).attr("data-id");
            var _type = $(this).attr("data-type");
            var _security_token = $("#geo_loc_id_token").val();
            var _data_seed = $(this).attr("data-seed");
            
            // Callback Function
            $.post( "/js/class/class-authenticate", { id:_id, type:_type, security_token:_security_token, data_seed:_data_seed }, function( data ) {
                var response = JSON.parse(data);    
                if(response["type"] == "SUCCESS") {
                    toastr.clear();
                    toastr["success"]("You have successfully removed this authenticated account from Social Blade's database.");
                  
                } else {
                    toastr.clear();
                    toastr["error"](response["message"]);                    
                }
            });
            
            // Hide element
            $(this).parent().parent().parent().parent().hide(150);
            $("#notification-authenticated-number-message").show();  
        });
    }
    
        if(URL[1] == "authenticate" || URL[1] == "products") {
                        
            // LIST ITER GLOBALIZATION WORKAROUND
            function list_iter() {
                list_iter = "";
            }
            list_iter();

            // GEOCODING
            $(".geo_loc_box_close").click(function(event) {
                event.preventDefault();
                var parent = $(this).parent()[0];
                $(parent).parent().hide();
                $("#notification_overlay").hide();
            });
            
            
            $(".geo_auth_map_marker").click(function(event) {
                event.preventDefault();
                var channelid = this.id;
                $.cookie('GEO_ID', channelid, { expires: 3000, path: '/' });
                $("#notification_overlay").show();
                $("#geo_"+channelid).show();
            });
            
            
            // TAGS
            $(".tags_auth_marker").click(function(event) {
                event.preventDefault();
                var channelid = this.id;
                $("#dropdown_"+channelid).hide();  
                $.cookie('TAG_ID', channelid, { expires: 3000, path: '/' });

                $("#notification_overlay").show();
                $("#tags_"+channelid).show();
                $("#input_"+channelid).focus();
            });            
            
            $(".tags_box_close").click(function(event) {
                event.preventDefault();
                var parent = $(this).parent()[0];
                $(parent).parent().hide();
                $("#notification_overlay").hide();
            });

            // BACKSPACE-DELETE TAG
            $('.sb-tags-input').on('keypress', function() {
             }).on('keydown', function(event) {        
                var id = $(this).parent().attr('id');
                var key_input = $(this).val();

                // SUBMIT ON TAB
                if (event.keyCode==9) {
                    if(key_input.length >= 2) {
                        add_tag_sequence(id, key_input, $(this));
                        var dropdown_var = id.replace("tags_", "");
                        $("#dropdown_"+dropdown_var).hide();
                         $("#input_"+dropdown_var).focus();
                        event.preventDefault();
                    } else {
                         $("#input_"+dropdown_var).focus();
                        event.preventDefault();
                    }
                }        
                // BACKSPACE
                if (event.keyCode==8) {
                    if(key_input.length == 0) {
                        var item_list = $(this).parent().children().siblings();
                        
                        var list_count = item_list.length;
                        if(list_count == 0) {
                            // DO NOTHING
                        } else {
                            var item_count = ((item_list.length-1)-1); 
                            _key_input = $(item_list[item_count]).children('.sb-tag-item').eq(0).text();
                            sb_tag_delete_delegate($(item_list[item_count]).children('.sb-tag-item'));
                            list_iter = "";
                        }                      
                    }
                }
                
                if(event.keyCode == 38 || event.keyCode == 40) {
                    // 38 - up
                    // 40 - down
                    
                    // DEFINE
                    var dropdown_var = id.replace("tags_", "");
                    
                    if(list_iter == "") {
                        list_iter = 0;                    
                    }
                    
                    if(key_input.length >= 2) {

                        var item_list = $("#dropdown_list_"+dropdown_var).children();
                                
                        // DOWN ARROW
                        if(event.keyCode == 40) {
                            $(".tags_list_item").removeClass("tag_list_hover");
                            list_iter++;   
                            
                            if(list_iter > item_list.length) {
                                list_iter = 1;
                            }
                            

                        }
                        
                        // UP ARROW
                        if(event.keyCode == 38) {
                            $(".tags_list_item").removeClass("tag_list_hover");
                            list_iter--;
                            if(list_iter <= 0) {
                                list_iter = item_list.length
                            }
                        }
                        
                        var specific_obj = $(item_list)[(list_iter-1)];
                        var specific_item = $(specific_obj);                        
                        
                        $("#input_"+dropdown_var).val(specific_item.text()).putCursorAtEnd();
                        $( specific_obj ).toggleClass( "tag_list_hover" )
      

                        // SCROLL LOGIC
                        if(item_list.length > 7) {
                            $("#dropdown_list_"+dropdown_var).scrollTo(".tag_list_hover");
                        }                        

                     
                    }
                }
            });
            
            // ADD TAG
            $('.sb-tags-input').on('keypress', function() {
            
             }).on('keyup', function(event) {
                // DEFINE
                var id = $(this).parent().attr('id');
                var key_input = $(this).val();

                // ON ENTER
                if (event.keyCode==13) {
                    if(key_input.length >= 2) {
                        add_tag_sequence(id, key_input, $(this));
                    } else {
                        // DO NOTHING
                    }
                }   
                
                
                // ON COMMA
                if (event.keyCode==188) {
                    if(key_input.length >= 2) {
                        key_input = key_input.slice(0,-1);
                        add_tag_sequence(id, key_input, $(this));
                    } else {
                        // DO NOTHING
                    }                    
                }               
                

                // BACKSPACE
                if (event.keyCode==8) {
                    var dropdown_var = id;
                    dropdown_var = dropdown_var.replace("tags_", "");

                    if(key_input.length < 2) {
                      $("#dropdown_"+dropdown_var).hide();  
                    }
                }


               
             });              

            // DELETE TAG
            $(".sb-tag-delete").click(function(event) {
                event.preventDefault();
                var handle = $(this).parent().children('.sb-tag-item');
                sb_tag_delete_delegate(handle);
            });


            function add_tag_sequence(id, key_input, sequence) {
                var isMatch = 0;
                id = id.replace("tags_", "");
                


                $("#dropdown_"+id).hide();

                var item_list = $(sequence).parent().children().siblings();
                var list_count = item_list.length;
                var escape_key = htmlEntities(key_input);



                
                
                // FOR REPORTS
                if(URL[1] == "products") {
                    var item_obj = {};

                    for(var y = 0; y < (item_list.length-1); y++) {
                       var _child = item_list[y];
                       var _child_text = $(_child).children('.sb-tag-item').eq(0).text()

                       item_obj[y] = _child_text;
                    }

                    var size_of_item_obj = Object.keys(item_obj).length;


                    var isDetected = 0;
                    for(var key in item_obj) {
                        var value = item_obj[key];
                        if(escape_key == value) {
                            isDetected = 1;
                        }
                    }
                    
                    if(isDetected == 1) {
                        isDetected = 0;
                    } else {
                        item_obj[size_of_item_obj] = escape_key;      
                    }

                    var item_obj_string = JSON.stringify(item_obj);
                    $("#reports_input").text(item_obj_string);
                }

                if(list_count == 0) {
                    var insert_html = '<div class = "sb-tag-list"><span class = "sb-tag-item">'+escape_key+'</span> <span class = "sb-tag-delete">x</span></div>';

                    $("#input_"+id).before(function() {
                        return $(insert_html).click(function(event) {
                            var target = event.currentTarget;
                            sb_tag_delete_delegate($(target).children('.sb-tag-item'));
                       });                                 
                    });

                    $("#input_"+id).val("");
                    $("#input_"+id).focus();

                    var identifier = id;
                    var security_token = $("#geo_loc_id_token").val();  
                    var tag_selected = key_input.toLowerCase();
                    var tag_type = URL[2];
                    var action = "add";  

                    if(URL[1] != "products") {
                        $.post( "/js/class/authenticated/user-tags", { tag_type:tag_type, action:action, identifier:identifier, tag_selected:tag_selected, security_token:security_token }, function( data ) {
                           // NOTHING
                       });                          
                    }
                    
                } else if(list_count > 0) {
                    item_list.splice(-1,1);

                    for(i = 0; i < item_list.length; i++) {
                        var child_item = item_list[i];
                        _key_input = $(child_item).children('.sb-tag-item').eq(0).text();

                        if(key_input.toLowerCase() == _key_input.toLowerCase()) {
                            $("#input_"+id).val("");
                            $("#input_"+id).focus();
                            isMatch = 1;
                        } else {                                
                            // DO NOTHING
                        }

                        // ADD TO LIST IF ITS NOT IN THERE
                        if(isMatch == 0 && i == (item_list.length-1)) {
                            var insert_html = '<div class = "sb-tag-list"><span class = "sb-tag-item">'+escape_key+'</span> <span class = "sb-tag-delete">x</span></div>';

                            $("#input_"+id).before(function() {
                                return $(insert_html).click(function(event) {
                                    var target = event.currentTarget;
                                    sb_tag_delete_delegate($(target).children('.sb-tag-item'));
                               });                                 
                            });

                            $("#input_"+id).val("");
                            $("#input_"+id).focus();

                            var identifier = id;
                            var security_token = $("#geo_loc_id_token").val();  
                            var tag_selected = key_input.toLowerCase();
                            var tag_type = URL[2];
                            var action = "add";  

                            if(URL[1] != "products") {
                                $.post( "/js/class/authenticated/user-tags", { tag_type:tag_type, action:action, identifier:identifier, tag_selected:tag_selected, security_token:security_token }, function( data ) {
                                    // NOTHING
                                });                             
                            }
                        }

                    }                          


                }  

          
                
           }            
            
            function sb_tag_delete_delegate(sequence) {
                var handle = sequence;
                var parent = handle.parent();
                var identifier = parent.parent().attr('id');
                var key_input = handle.text();
                var security_token = $("#geo_loc_id_token").val();
                var tag_type = URL[2];
                var action = "remove";
                var tag_selected = key_input;
 
                var item_obj = {};
 
                // FOR REPORTS
                if(URL[1] == "products") {
                    var item_list_obj = jQuery.parseJSON($("#reports_input").text());
                    var size_of_item_obj = Object.keys(item_list_obj).length;
                    var inner_index = 0;
                    
                    for(var i = 0; i < size_of_item_obj; i++) {
                        if(item_list_obj[i] != key_input) {
                            item_obj[inner_index] = item_list_obj[i];
                            inner_index++;
                        }
                    }
                              
                    var item_obj_string = JSON.stringify(item_obj);
                    if(item_obj_string == "{}")
                        item_obj_string = "";
                    
                    $("#reports_input").text(item_obj_string);
                }                
                
                
                if (key_input.length > 0) {
                    // GRAB IDENTIFIER
                    identifier = identifier.replace("tags_", "");

                    parent.remove();
                    if(tag_type != "query") {
                        $.post( "/js/class/authenticated/user-tags", { tag_type:tag_type, action:action, identifier:identifier, tag_selected:tag_selected, security_token:security_token }, function( data ) {

                        });                         
                    }
                       
                }
            }
            
            // EDIT TAG
            $(".sb-tag-item").on('click', function(event) {
                var parent = $(this).parent().parent();
                var tag_item = $(this).text();
                var identifier = parent.attr('id');

                    // GRAB IDENTIFIER
                    identifier = identifier.replace("tags_", "");

                    var list_id = "input_"+identifier;                

                    // POP VALUE OUT OF LIST IF PRESENT
                    sb_tag_delete_delegate($(this));

                    // UPDATE VALUE
                    $("#"+list_id).val(tag_item);
            });

            // INPUT CLICK FIX
            $(".sb-tags").on('click', function(event) {
                var _id = this.id;
                identifier = _id.replace("tags_", "");
                $("#input_"+identifier).focus();
            });

            // TYPEAHEAD
            $('.sb-tags-input').on('input', function(event) {
                event.preventDefault();
                
                var key_input = $(this).val();
                sb_tags_input_typeahead($(this), key_input, true);
                
            });   
            
            function sb_tags_input_typeahead(sequence, key_input, doUpdate = false) {
                // GRAB IDENTIFIER

                var parent = $(sequence).parent().parent().parent()[0];        
                var id = parent.id;
                id = id.replace("tags_", "");
                        
                if(key_input.length >= 2) {
                    // DEFINES
                    var security_token = $("#geo_loc_id_token").val();
                    var tag_type = URL[2];
                    var tag_selected = key_input;

                    if(doUpdate == true) {
                        list_iter = "";
                        $.post( "/js/class/authenticated/tags-typeahead-lookup", { tag_type:tag_type, tag_selected:tag_selected, security_token:security_token }, function( data ) {
                           var response = JSON.parse(data);

                           if(response.length > 0) { 
                   
                               // BLANK IT
                               $( "#dropdown_list_"+id ).html("");

                               // SCROLL IT
                               if(response.length >= 15) {
                                   $( "#dropdown_list_"+id ).css('overflow-y', 'scroll'); 
                               } else {
                                   $( "#dropdown_list_"+id ).css('overflow-y', 'hidden'); 
                               }

                               // FILL IT
                               for(i = 0; i < response.length; i++) {

                                   $( "#dropdown_list_"+id ).append(function() {
                                       return $("<li class = 'tags_list_item' id = '" + htmlEntities(response[i]) + "'>" +htmlEntities(response[i])+"</li>").click(function() {

                                               var list_text = $(this).text();

                                               var list_id = "input_"+id;
                                               $(list_id).val(list_text);

                                               var list_obj = $(list_id);
                                               add_tag_sequence(id, list_text, list_obj);
                                      }); 
                                   });

                               }


                               // SHOW IT
                               $("#dropdown_"+id).show();
                           } else {
                               // HIDE IT
                                $("#dropdown_"+id).hide();
                           }

                       });                       
                    }
                }
            }


            $(".geo_auth_map_marker-btn").click(function(event) {
                event.preventDefault();
                
                
                var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };
 
                var query = $.cookie('GEO_ID'); 

                if(URL[2] == "youtube") {
                    var query_type = "youtube";
                }

                if(URL[2] == "twitch") {
                    var query_type = "twitch";
                }

                if(URL[2] == "instagram") {
                    var query_type = "instagram";
                }

                if(URL[2] == "twitter") {
                    var query_type = "twitter";
                }          

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition, errorCallback, options);
                } else {
                    toastr.clear();
                    toastr["error"]("You are either on an unsupported browser, or have previously denied location to be tracked on this website.", "HTML5 Geolocation");
                }
                function showPosition(position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    var security_token = $("#geo_loc_id_token").val();
                    if(URL[1] == "products" && URL[2] == "query") {
                        query = "REPORTS";
                        query_type = "REPORTS";
                    }
                    
                    $.post( "/js/class/dashboard-location", { query:query, query_type: query_type, lat:lat, lng:lng, security_token:security_token }, function( data ) {
                        var response = JSON.parse(data);
                        if(response["status"] === "200" || response["status"] == "201") {
                            toastr.clear();
                            
                            if(response["status"] == "200") {
                                $("#notification_overlay").hide();
                                $(".geo_loc_box").hide();
                                $(".geo_loc_input").val("");
                                toastr["success"]("Your Location for this account has been Updated", "Set Location");
                                var modify_loc = response["modify_location"];

                                if(URL[1] == "authenticate") {
                                    $("#addy_"+response["data"]).text(modify_loc);
                                } else {
                                    $(".geo_loc_input").val(modify_loc);
                                }                                
                            } else {
                                 var modify_loc = response["location"];
                                 $("#geo_loc_reports").val(modify_loc);                                 
                            }
                            
                        } else {
                             
                            if(response["message"] === "SECURITY_TOKEN") {
                                toastr.clear();
                                toastr["error"]("There is a security token mismatch for this action", "Security Warning");         
                            } else if(response["message"] === "USER_LOGGED_IN") {
                                toastr.clear();
                                toastr["error"]("We are unable to verify your session at this time", "Security Warning");                  
                            } else if(response["message"] === "CANNOT_DETERMINE_LATLNG") {
                                toastr.clear();
                                toastr["error"]("We are unable to determine your chosen location at this time. Please report.", "Set Location");                  
                            } else {
                                toastr.clear();
                                toastr["error"]("An unknown error has occured which has prevented completing this task. Please report.", "Unknown #7248");
                            }                            
                        }
                    });
                }

                function errorCallback(error) {
                    if (error.code == error.PERMISSION_DENIED) {
                        toastr["error"]("It looks like you have blocked Social Blade from getting your location via the HTML5 Geolocation Library :(", "HTML5 Geolocation");
                    }
                }                 
            });
        }

        if(URL[1] == "account") {
            $("#account_geoloc_btn").click(function(event) {
                event.preventDefault();
                
                
                var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition, errorCallback, options);
                } else {
                    toastr.clear();
                    toastr["error"]("You are either on an unsupported browser, or have previously denied location to be tracked on this website.", "HTML5 Geolocation");
                }
                
                function showPosition(position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    var security_token = $("#geo_loc_id_token").val();
                    $.post( "/js/class/dashboard-location-lookup", { security_token: security_token, lat:lat, lng:lng }, function( data ) {
                        var response = JSON.parse(data);
                        if(response["status"] === "200") {
                            toastr.clear();
                            toastr["success"]("Your Default Location has been Updated", "Set Location");
                            var modify_loc = response["modify_location"];
                            $(".geo_loc_input").val(modify_loc);
                        } else {
                            if(response["message"] === "SECURITY_TOKEN") {
                                toastr.clear();
                                toastr["error"]("There is a security token mismatch for this action", "Security Warning");         
                            } else if(response["message"] === "USER_LOGGED_IN") {
                                toastr.clear();
                                toastr["error"]("We are unable to verify your session at this time", "Security Warning");                  
                            } else if(response["message"] === "CANNOT_DETERMINE_LATLNG") {
                                toastr.clear();
                                toastr["error"]("We are unable to determine your chosen location at this time. Please report.", "Set Location");                  
                            } else if(response["message"] === "CANNOT_DETERMINE_CITY_COUNTRY") {
                                toastr.clear();
                                toastr["error"]("It looks like this location is not a valid Google Maps city, state/province, country combination", "Set Location");                  
                            } else {
                                toastr.clear();
                                toastr["error"]("An unknown error has occured which has prevented completing this task. Please report.", "Unknown #7248");
                            }
                        }
                    });
                }

                function errorCallback(error) {
                    if (error.code == error.PERMISSION_DENIED) {
                        toastr["error"]("It looks like you have blocked Social Blade from getting your location via the HTML5 Geolocation Library :(", "HTML5 Geolocation");
                    }
                }                
            });

            $("#account_geoloc_btn_trash").click(function(event) {
                event.preventDefault();

                var security_token = $("#geo_loc_id_token").val();
                $.post( "/js/class/dashboard-location-trash", { security_token: security_token }, function( data ) {
                    var response = JSON.parse(data);
                    
                    if(response["status"] === "200") {
                        toastr.clear();
                        toastr["success"]("Your Default Location has been deleted", "Set Location");
                        $("#geo_loc_input").val("");
                    } else {
                        if(response["message"] === "SECURITY_TOKEN") {
                            toastr.clear();
                            toastr["error"]("There is a security token mismatch for this action", "Security Warning");         
                        } else if(response["message"] === "USER_LOGGED_IN") {                            
                            toastr.clear();
                            toastr["error"]("We are unable to verify your session at this time", "Security Warning");                  
                        } else {
                            toastr.clear();
                            toastr["error"]("An unknown error has occured which has prevented completing this task. Please report.", "Unknown #5232");
                        }
                    }
                });                
                
            });
            
        }

	// REGISTER
	if(URL[1] == "register") {
        $("#submit-register-button").click(function(event) {
            event.preventDefault();
            grecaptcha.execute();
        });
	}
    
    // Report Cards
    if(URL[1] == "reports" && URL[2] == "cards") {


        $("#reports-cards-generate-button").click(function(event) {
            event.preventDefault();

            var textarea = $("#reports-cards-generate-textarea").val().split("\n");  

            // Remove Duplicates
            textarea = uniq(textarea);

            var platform = $("#reports-cards-generate-textarea").attr("data-platform");
            var count = textarea.length;

            var isError = 0;
            var error_message;
            var isPremium = $("#reports-cards-generate-textarea").attr("data-type");

            // Check if empty
            if(textarea[0].length == 0) {
                count = 0;
            }

            // check if in the correct format
            if(count > 0) {
                if(platform == "youtube") {
                    var channelid;
                    for(i = 0; i <= (count-1); i++) {
                        channelid = textarea[i].replace(",", "");
                        if(channelid.length == 24) {

                        } else {
                            isError = 1;
                            error_message = "Some of the channelid's entered do not appear to be actual channelid's";
                        }
                    }
                }
            } else {
                isError = 1;
                error_message = "It does not appear that you put anything into the textarea."
            }

            if(isPremium < 2) {
                isError = 1;
                error_message = "You need at least a silver premium membership to generate report cards at Social Blade";
            }
            
            if(isError == 0) {

                var time_taken = (count-1) * 5;     
                $("#report-cards-screen-output-time-text").text(time_remaining(time_taken+5));
                $("#report-cards-text-number-generating").text(count);
                if(count == 1) {
                    $("#report-cards-text-cardsare-isplural").text("Card is");
                } else {
                    $("#report-cards-text-cardsare-isplural").text("Cards are");                                
                }                

                $("#reports-cards-screen-output-conclusion").show();
                $("#reports-cards-generate-button").hide();

                if(platform == "youtube") {
                    var channelid;

                    for(i = 0; i <= (count-1); i++) {
                        channelid = textarea[i].replace(",", "");
                        if(channelid.length == 24) {
                            var thisobj = $("#reports-reportcard-generate");
                            $(thisobj).attr("data-query", channelid);
                            btn_reports_get_report_card(2, $(thisobj));
                        }
                    }

                    (function report_card_pseudo_timer (y) {          
                        setTimeout(function () {   
                            
                           if (--y) report_card_pseudo_timer(y);
                           if(y == 0) {
                               $("#reports-cards-screen-output-conclusion").css("background-color", "#4CAF50"); 
                               $("#reports-cards-screen-output-conclusion-text").html("Single User Reports successfully generated");
                               $("#reports-cards-screen-output-conclusion-icon").attr('class', "fa fa-check-circle-o fa-3x fa-fw");
                               $("#reports-cards-screen-output-conclusion-subtext").html("Check the <a style = 'color:#fff;' href = '/reports/cards'>Report Cards list</a> section the generated content");

                           }
                        }, 5000)
                     })(i);                        
                }
            } else {
                toastr.clear();
                toastr["error"](error_message);
            }

        })        
    }
	
	// ACTION MENU FOR YOUTUBE USER PAGES
    if(URL[1] == "youtube") {

        // REPORT CARDS
        $("#btn-reports-reportcard-get-report-card").click(function(event) {
            event.preventDefault();

            // CALL GET FUNCTION FOR REPORTS
            btn_reports_get_report_card(0);
        });

        $("#btn-reports-reportcard-time-issue").click(function(event) {
            event.preventDefault();

            // HIDE THIS BUTTON
            $(this).hide();

            // CALL GET FUNCTION FOR REPORTS
            btn_reports_get_report_card(1);            

        })

        

	    $(".youtube-user-share").click(function() {
		var _datarole = $(this).attr("data-role") 
		
		// DAILY
		if(_datarole == "share-daily-average") {
		    if($("#youtube-user-share-daily").is(":visible")) {
			$("#youtube-user-share-daily").hide();
			$("#popup_overlay").hide();
		    } else {
			$("#youtube-user-share-daily").show();
			$("#popup_overlay").show();
		    }		    
		}
		
		// MONTHLY
		if(_datarole == "share-monthly-average") {
		    if($("#youtube-user-share-monthly").is(":visible")) {
			$("#youtube-user-share-monthly").hide();
			$("#popup_overlay").hide();
		    } else {
			$("#youtube-user-share-monthly").show();
			$("#popup_overlay").show();
		    }		    
		}	
		
		// YEARLY
		if(_datarole == "share-yearly-average") {
		    if($("#youtube-user-share-yearly").is(":visible")) {
			$("#youtube-user-share-yearly").hide();
			$("#popup_overlay").hide();
		    } else {
			$("#youtube-user-share-yearly").show();
			$("#popup_overlay").show();
		    }		    
		}	
	    });
        // Sidebar
        $(".youtube-video-embed").mouseover(function(event) {
                var videoid = $(this).attr('id');
                var channelid = $(":first-child", this).attr('id');
                var width = $(this).width();
                var height = $(this).height();
                DirectURL = '<iframe width="'+width+'px" height="'+height+'px" src="//www.youtube.com/embed/'+videoid+'?autoplay=0&rel=0" frameborder="0" allowfullscreen></iframe>';
                $(this).html(DirectURL);

                $(this).unbind("mouseover");


                $.post( "/js/class/statistics-video-increment", { channelid:channelid, videoid:videoid, type:1 }, function( data ) {
                    var response = JSON.parse(data);
                });

        });

        $(".youtube-video-embed-network").mouseover(function(event) {
                var videoid = $(this).attr('id');
                var channelid = $(":first-child", this).attr('id');
                var width = $(this).width();
                var height = $(this).height();
                DirectURL = '<iframe width="'+width+'px" height="'+height+'px" src="//www.youtube.com/embed/'+videoid+'?autoplay=0&rel=0" frameborder="0" allowfullscreen></iframe>';
                $(this).html(DirectURL);

                $(this).unbind("mouseover");

                $.post( "/js/class/statistics-video-increment", { channelid:channelid, videoid:videoid, type:2 }, function( data ) {
                        var response = JSON.parse(data);
                        //console.log(response);
                });

        });


        // Summary Video
        $(".youtube-video-embed-recent").mouseover(function(event) {
                var videoid = $(this).attr('id');
                var width = $(this).width();
                var height = $(this).height();
                DirectURL = '<iframe width="'+width+'px" height="'+height+'px" src="//www.youtube.com/embed/'+videoid+'?autoplay=0&rel=0" frameborder="0" allowfullscreen></iframe>';
                $(this).html(DirectURL);

                $(this).unbind("mouseover");
        });

        // OTHER CHANS
        if(URL[4] == "otherchans") {

            $("#btn-youtube-otherchans-featuring").click(function(event) {
                event.preventDefault(); // PREVENT & CONTINUE
                $("#youtube-otherchans-header-title").text("Featured Box for");

                $("#youtube-otherchans-table-featured-by").hide();
                $("#youtube-otherchans-table-featuring").show();
            });

            $("#btn-youtube-otherchans-featured-by").click(function(event) {
                event.preventDefault(); // PREVENT & CONTINUE
                $("#youtube-otherchans-header-title").text("YouTubers featuring");

                $("#youtube-otherchans-table-featuring").hide();
                $("#youtube-otherchans-table-featured-by").show();
            });
        }


    }


    if(URL[1] == "dailymotion") {
	
	    // VIDEOS
	    $( ".dm-video-container" )
	    .mouseenter(function() {		
		$(this).find(".dm-video-container-hover").show();
	    })
	    .mouseleave(function() {
		$(this).find(".dm-video-container-hover").hide();
	    });	    
	    
	    $(".dm-video-container").click(function() {
		var container = $(this).find(".dm-video-container-hover");
		container = $(container).data();
		var _video = container["video"];
		
		
		var vidout = '<iframe id = "dm-video-embed" frameborder="0" width="700" height="394" src="//www.dailymotion.com/embed/video/'+_video+'?autoplay=0&mute=0"></iframe>'
		$( "#dm-lightbox" ).append(vidout);
		$("#popup_overlay").show();
		$("#dm-lightbox").show();
	    });	    
	
	
	
	    // SHARES
	    $(".dailymotion-user-share").click(function() {
		var _datarole = $(this).attr("data-role") 
		
		// DAILY
		if(_datarole == "share-daily-average") {
		    if($("#dailymotion-user-share-daily").is(":visible")) {
			$("#dailymotion-user-share-daily").hide();
			$("#popup_overlay").hide();
		    } else {
			$("#dailymotion-user-share-daily").show();
			$("#popup_overlay").show();
		    }		    
		}
		
		// MONTHLY
		if(_datarole == "share-monthly-average") {
		    if($("#dailymotion-user-share-monthly").is(":visible")) {
			$("#dailymotion-user-share-monthly").hide();
			$("#popup_overlay").hide();
		    } else {
			$("#dailymotion-user-share-monthly").show();
			$("#popup_overlay").show();
		    }		    
		}	
		
		// YEARLY
		if(_datarole == "share-yearly-average") {
		    if($("#dailymotion-user-share-yearly").is(":visible")) {
			$("#dailymotion-user-share-yearly").hide();
			$("#popup_overlay").hide();
		    } else {
			$("#dailymotion-user-share-yearly").show();
			$("#popup_overlay").show();
		    }		    
		}	
	    });
    }

    // REAL TIME
    var isRealtime = 0;
    if((URL[1] == "youtube" || URL[1] == "twitch" || URL[1] == "twitter" || URL[1] == "instagram" || URL[1] == "dailymotion" || URL[1] == "mixer")) {        
        if((URL[4] == "realtime" || URL[2] == "realtime")) {
            isRealtime = 1;
        }
    }

    if(isRealtime == 1) {
		var inner_tick = 0;
        var real_counter = 0;
		var tick_count = 1;
		var original_num = $("#rawCount").text();
		const soundEffects = {
            winner: new Audio('/media/effects/winner.mp3'),
            ding: new Audio('/media/effects/ding.mp3'),
            coin: new Audio('/media/effects/coin.mp3')
		};

		if(original_num > 250000) {
            tick_count = 1;
		} else if(original_num > 100000) {
            tick_count = 2;
		} else if(original_num > 25000) {
            tick_count = 3;
		} else if (original_num > 10000) {
            tick_count = 4;
		} else if (original_num > 5000) {
            tick_count = 5;
		} else {
            tick_count = 8;
		}

		test = 999980;

		var realtimeSettings = {};
		var defaultRealtimeSettings = JSON.stringify({
            milestonesFreeze: false,
            progressionGraph: true,
            casinoMode: false,
            volume: 20 / 100
		});



		$(document).ready(function() {
            if(typeof localStorage.realtimeSettings != 'undefined') {
                realtimeSettings = JSON.parse(localStorage.realtimeSettings);
                if(typeof localStorage.afdrt != 'undefined') {
                    delete localStorage.afdrt;
                    realtimeSettings.casinoMode = false;
                    localStorage.setItem("realtimeSettings", JSON.stringify(realtimeSettings));
                }
            } else {
                if(storageCheck('localStorage')) {
                    localStorage.setItem("realtimeSettings", defaultRealtimeSettings);
                    realtimeSettings = JSON.parse(localStorage.realtimeSettings);
                } else {
                    console.log('localStorage isn\'t available. Disabling customization controls.');
                    $('div.page-title .containment i.fa-cogs').hide();
                    realtimeSettings = JSON.parse(defaultRealtimeSettings);
                }
            }

            $("#milestones10s option[value="+realtimeSettings.milestonesFreeze+"]").attr('selected','selected');
            $("#progressionGraph option[value="+realtimeSettings.progressionGraph+"]").attr('selected','selected');
            $("#casinoMode option[value="+realtimeSettings.casinoMode+"]").attr('selected','selected');
            $("#volume").val(realtimeSettings.volume*100);
            if(!realtimeSettings.progressionGraph) $('#realtime-live-chart').hide();
            if(realtimeSettings.casinoMode) {
                $('#counterStyle').attr('href', '/css/flip/odometer-theme-slot-machine.css');
                $('.odometer').attr('class', 'odometer odometer-theme-slot-machine');
                soundEffects.ding.volume = realtimeSettings.volume;
                soundEffects.winner.volume = realtimeSettings.volume;
                $('#volumeSection').show();
            } else {
                $('#counterStyle').attr('href', '/css/flip/odometer-theme-minimal.css');
                $('.odometer').attr('class', 'odometer odometer-theme-minimal');
                $('#volumeSection').hide();
            }
		});

		var maxPoints = 3600; // 1h
		var initial_value = 0;
		
        var realtime_tick = 1000;
        if(URL[1] == "youtube") {
            realtime_tick = 1000;
        } else if(URL[1] == "twitter") {
            realtime_tick = 2000;
        } else if(URL[1] == "instagram") {
            realtime_tick = 2000;
        } else if(URL[1] == "twitch") {
            realtime_tick = 2000;
        } else if(URL[1] == "dailymotion") {
            realtime_tick = 2000;
        } else if(URL[1] == "mixer") {
            realtime_tick = 2000;
        }
                
		var updateCounter = function() {
			inner_tick++;
            real_counter++;
			if(real_counter == 10) {
                $('#realtime-live-chart').highcharts().series[0].data[0].remove();
                $('#realtime-live-chart').highcharts().series[0].data[0].remove();
			}

            if($("#rawCount").text() == 0) {
                if($("#realtime-error-info-0-count").is(":hidden")) {
                    $("#realtime-error-info-0-count").show(200);  
                }

            } else {
                if($("#realtime-error-info-0-count").is(":visible")) {
                    $("#realtime-error-info-0-count").hide();
                }  
            }

            var now = new Date();
            var time = now.getTime();
            var localOffset = (-1) * now.getTimezoneOffset() * 60000;
            var x = new Date(time + localOffset).getTime();
                        
			if(inner_tick >= tick_count) {
				inner_tick = 0;
                var json_url;

                if(URL[1] == "youtube") {
                    json_url = "https://bastet.socialblade.com/youtube/lookup?query="+$('#rawUser').text();
                } else if(URL[1] == "twitch") {
                    json_url = "https://bastet.socialblade.com/twitch/lookup?query="+$('#rawUser').text();
                } else if(URL[1] == "instagram") {
                    json_url = "https://bastet.socialblade.com/instagram/lookup?query="+$('#rawUser').text();
                } else if(URL[1] == "twitter") {
                    json_url = "https://bastet.socialblade.com/twitter/lookup?query="+$('#rawUser').text();
                } else if(URL[1] == "dailymotion") {
                    json_url = "https://bastet.socialblade.com/dailymotion/lookup?query="+$('#rawUser').text();
                } else if(URL[1] == "mixer") {
                    json_url = "https://bastet.socialblade.com/mixer/lookup?query="+$('#rawUser').text();
                }

                

                $.ajax({
                    url: json_url,
                    success: function(e) {
                        // e=test;
                        if(realtimeSettings.milestonesFreeze) milestoneChecker(e);

                        if(realtimeSettings.casinoMode){ if($("#rawCount").text() < e) soundEffects.ding.play(); }
                        if(realtimeSettings.casinoMode){ if($("#rawCount").text() > e) soundEffects.coin.play(); }

                        $(".odometer").html(e);
                        $("#rawCount").text(e);

                        if ($('#realtime-live-chart').highcharts().series[0].points.length == maxPoints) $('#realtime-live-chart').highcharts().series[0].data[0].remove();
                        $('#realtime-live-chart').highcharts().series[0].addPoint([x, e], true, false);
                    }
                });
			} else {
				if ($('#realtime-live-chart').highcharts().series[0].points.length == maxPoints) $('#realtime-live-chart').highcharts().series[0].data[0].remove();
				$('#realtime-live-chart').highcharts().series[0].addPoint([x, parseInt($("#rawCount").text())], true, false);
            }
			
			initial_value++;
		};

		var update = setInterval(updateCounter, realtime_tick);

		var milestone = null;
		var milestoneAlerted = false;
		var milestoneChecker = function(e) {
			if(e.toString().length >= 4) {
				if(e.toString() >= milestone && milestone != null && milestoneAlerted === false) {
					console.log("CONGRATS ON "+number_format(milestone)+" SUBSCRIBERS!");
					milestoneAlerted = true;
					if(realtimeSettings.casinoMode) soundEffects.winner.play();
					clearInterval(update);
					$(".odometer").html(number_format(milestone));
					setTimeout(function(){
						var update = setInterval(updateCounter, 1000);
					}, 10000);
					// test=995;
				}
				milestone = (Number(e.toString().substring(0, 2)) + 1).toString();
				for(z = 1; z <= Number(e.toString().length)-2; z++) {
					milestone += 0;
				}
			} else if(e.toString().length == 3) {
				if(e.toString() >= milestone && milestone != null && milestoneAlerted === false) {
					console.log("CONGRATS ON "+number_format(milestone)+" SUBSCRIBERS!");
					milestoneAlerted = true;
					if(realtimeSettings.casinoMode) soundEffects.winner.play();
					clearInterval(update);
					$(".odometer").html(number_format(milestone));
					setTimeout(function(){
						var update = setInterval(updateCounter, 1000);
					}, 10000);
					// test=395;
				}
				milestone = (Number(e.toString().slice(0, -2))+1).toString()+'00';
			} else if(e == 25 | e == 50 | e == 75) {
				if(milestoneAlerted === false) {
					console.log("CONGRATS ON "+e+" SUBSCRIBERS!");
					milestoneAlerted = true;
					if(realtimeSettings.casinoMode) soundEffects.winner.play();
					clearInterval(update);
					setTimeout(function(){
						var update = setInterval(updateCounter, 1000);
					}, 10000);
					// test=0;
				}
			}
			console.log(milestone);
		};

		$('.share a.twitter').on("click", function (event) {
			event.preventDefault();
			window.open($(this).attr("href"), "popupWindow", "width=600, height=400, scrollbars=no");
		});

		$('.share a.facebook').on("click", function (event) {
			event.preventDefault();
			window.open($(this).attr("href"), "popupWindow", "width=600, height=400, scrollbars=no");
		});

		$('.share a.google').on("click", function (event) {
			event.preventDefault();
			window.open($(this).attr("href"), "popupWindow", "width=600, height=400, scrollbars=no");
		});

		$('.meta a').on("click", function (event) {
			event.preventDefault();
			window.open($(this).attr("href"), "popupWindow", "width=645, height=715, scrollbars=no");
		});

		$('#userName').on('click', function() {
			changeUser();
		});

		$('div.page-title .containment i.fa-users').on('click', function() {
                    changeUser();
		});

		$('.dialog_window .description-question + div input').on("keydown", function(e) {
			if(e.keyCode === 13) $('.dialog_window .description-question + div i').click();
		});

		$('.dialog_window .description-question + div i').on('click', function() {
                    var page_type = URL[1];   
                    $.ajax({
                        url: "/js/class/realtime-stats-fetch",
                        data: { query: $('.dialog_window .description-question + div input').val(), page_type:page_type },
                        dataType: "JSON",
                        success: function(e) {
                            if(e == "-1") {
                                $('.alert').html("<b>"+$('.dialog_window .description-question + div input').val().replace(/[^\w\s]/gi, '')+"</b> not detected in our system.").fadeIn();
                                setTimeout(function() {
                                        $(".alert").fadeOut();
                                }, 5000);
                            } else {
                                e = "//"+window.location.hostname+e.replace("//socialblade.com", "");
                                window.location = e;
                            }
                        }
                    });
		});

		$('div.page-title .containment i.fa-cogs').on('click', function() {
			changeSettings();
		});

		$("#casinoMode").on("change", function() {
			if($("#casinoMode").val() == "true") $('#volumeSection').show();
			if($("#casinoMode").val() != "true") $('#volumeSection').hide();
		});

		$('#settingSave').on('click', function() {
			$('#changeLiveSettings').dialog('close');
			localStorage.setItem("realtimeSettings", JSON.stringify({
				milestonesFreeze: ($("#milestones10s").val() === "true"),
				progressionGraph: ($("#progressionGraph").val() == "true"),
				casinoMode: ($("#casinoMode").val() == "true"),
				volume: $("#volume").val()/100
			}));
			realtimeSettings = JSON.parse(localStorage.realtimeSettings);
			if(!realtimeSettings.progressionGraph) $('#realtime-live-chart').hide();
			if(realtimeSettings.progressionGraph) $('#realtime-live-chart').show();
                        
			if(realtimeSettings.casinoMode) {
				$('#counterStyle').attr('href', '/css/flip/odometer-theme-slot-machine.css');
				$('.odometer').attr('class', 'odometer odometer-theme-slot-machine');
				$('#volumeSection').show();
			} else {
				$('#counterStyle').attr('href', '/css/flip/odometer-theme-minimal.css');
				$('.odometer').attr('class', 'odometer odometer-theme-minimal');
				$('#volumeSection').hide();
			}
			soundEffects.ding.volume = realtimeSettings.volume;
			soundEffects.winner.volume = realtimeSettings.volume;
			console.log("Settings Saved.");
		});

		var changeUser = function() {
			$("#changeLiveUser").dialog({
				resizable:false,
				modal:true,
				minWidth:500,
				draggable:false,
				closeText:"X",
			    open: function(){
			        $('.ui-widget-overlay').bind('click', function() {
			            $('#changeLiveUser').dialog('close');
			        });
			    }
			});
		};

		var changeSettings = function() {
			$("#changeLiveSettings").dialog({
				resizable:false,
				modal:true,
				minWidth:500,
				draggable:false,
				closeText:"X",
			    open: function(){
			        $('.ui-widget-overlay').bind('click', function() {
			            $('#changeLiveSettings').dialog('close');
			        });
			    }
			});
		};

		setTimeout(function() {
			if(realtimeSettings.progressionGraph) realtimeGraph();
		}, 500);

		var realtimeGraph = function() {
                    
                        if(URL[1] == "youtube") {
                            var var_type = "Subscribers";
                        } else if(URL[1] == "twitch") {
                            var var_type = "Followers";
                        } else if(URL[1] == "instagram") {
                            var var_type = "Followers";
                        } else if(URL[1] == "twitter") {
                            var var_type = "Followers";
                        }                    
                    
			$('#realtime-live-chart').highcharts({
				chart: {
                                    type: 'spline',
                                    zoomType: 'x',
                                    animation: Highcharts.svg, marginRight: 10,
                                    backgroundColor: 'transparent',
                                    spacingLeft: 0,
                                    spacingRight: 0,
                                    events: { load: function () { } }
				},
				plotOptions: { series: {
                                    lineWidth: 3, marker: { enabled: false } }
				},
				title: { text: '' },
				xAxis: { title: { text: '' }, type: 'datetime', tickPixelInterval: 150 },
				yAxis: { title: { text: '' },
                                    labels: {  enabled: false },
                                    plotLines: [{
                                        value: 0,
                                        width: 1,
                                        color: '#808080'
                                    }], allowDecimals: false
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' + numberWithCommas(this.y, 2);
					}
				},
				legend: { enabled: false },
				exporting: { enabled: false },
				series: [{ name: var_type, color: '#c76c6c', data: (function () { }()) }]
			});
		};
	}

        /**
         * 
         * 
         *  TOP CHARTS LOGIC
         * 
         * 
         */
        
        $("#sort-by-container").click(function(event) {
            event.preventDefault();
            $("#sort-by-dropdown").slideToggle(100);
        });

        // HIDE SORT BY CLICKING OUT OF THE ELEMENT
        $(document).on('click', function (e) {
            if ($(e.target).closest("#sort-by").length === 0) {
                $("#sort-by-dropdown").slideUp(100);
            }
        });    

        
        $(".sort-by-select").click(function(event) {
            event.preventDefault();
            var _title = $(this).data('title');
            var _sort = $(this).data('sort');
            $("#sort-by-current-title").text(_title);
            // TOP PAGES
            if(URL[2] == "top" || URL[2] == "game") {
                var query = URL[4];
                var type = URL[1];
                var _url;            
                // TAG TOP PAGES
                if(URL[2] == "top") {
                    if(!URL[3]) {
                        if(_sort == "sbscore") { _url = "/"+type+"/top/50"; }
                        else { _url = "/"+type+"/top/50/"+_sort; }
                        window.location.href = _url;                    
                    } else if(URL[3] == "tag") {
                        if(_sort == "sbrank") { _url = "/"+type+"/top/tag/"+query; } 
                        else { _url = "/"+type+"/top/tag/"+query+"/"+_sort; }
                        window.location.href = _url;
                    } else if(URL[3] == "category") {
                        if(_sort == "sbscore") { _url = "/"+type+"/top/category/"+query; }
                        else { _url = "/"+type+"/top/category/"+query+"/"+_sort; }
                        window.location.href = _url;
                    } else if(URL[3] == "country") {   
                        if(_sort == "sbscore") { _url = "/"+type+"/top/country/"+query; }
                        else { _url = "/"+type+"/top/country/"+query+"/"+_sort; }
                        window.location.href = _url;
                    } else if(URL[3] == parseInt(URL[3])) {
                        if(_sort == "sbscore") { _url = "/"+type+"/top/"+URL[3]; }
                        else { _url = "/"+type+"/top/"+URL[3]+"/"+_sort; }
                        window.location.href = _url;
                    } else if(URL[3] == "trending") {
                        _url = "/"+type+"/top/"+URL[3]+"/"+query+"/"+_sort;
                        window.location.href = _url;                    
                    } else if(URL[3] == "networks") {
                        _url = "/"+type+"/top/"+URL[3]+"/"+_sort;
                        window.location.href = _url;
                    }                    
                } else if(URL[2] == "game") {
                    _url = "/"+type+"/game/"+URL[3]+"/"+URL[4]+"/"+_sort;
                    window.location.href = _url;
                }
            }            
        });        
        
        
        // WIDGET SEARCH FOR TOP PAGES
        $("#widget-search-submit").click(function(event) {
            event.preventDefault();
            var query = $("#widget-search-input").val();
            toastr.clear();
            if(query.length >= 3) {
                var _url = $(this).data('url');
                query = query.replace(/\s+/g, '-').toLowerCase();
                _url = _url + query
                //console.log(_url);
                window.location.href = _url;
            } else {
                toastr["error"]("Tags must be at least 3 characters long");
            }
        });

        // HIT ENTER WITHIN INPUT TO SUBMIT WIDGET SEARCH FOR TOP PAGES
            // ADD TAG
            $('#widget-search-input').on('keypress', function() {
            
             }).on('keyup', function(event) {
                // DEFINE
                var query = $(this).val();
                
                
                if(event.keyCode === 13) {
                    toastr.clear();
                    if(query.length >= 3) {
                        var _url = $("#widget-search-submit").data('url');
                        query = query.replace(/\s+/g, '-').toLowerCase();
                        _url = _url + query;
                        window.location.href = _url;
                    } else {
                        toastr["error"]("Tags must be at least 3 characters long");
                    }                   
                }
            }
        );

	$("#turn-off-april-fools-day-editing").click(function(event) {
		event.preventDefault();
		$("#april-fools-day-top-user-bar").hide();
		$("#april-fools-day-top-user-bar-exit").show();

	});

	$("#april-fools-day-top-user-bar-exit-yes").click(function(event) {
            event.preventDefault();
            $.post( "/js/class/afd/aprilfoolsday", { active:0 }, function( data ) {
                var response = data;
                console.log(response);
                if(response == "SUCCESS") {
                    location.reload();
                }
            });
	});

	$("#turn-on-april-fools-day-editing").click(function(event) {
            event.preventDefault();
            $.post( "/js/class/afd/aprilfoolsday", { active:1 }, function( data ) {
                var response = data;
                console.log(response);
                if(response == "SUCCESS") {
                    location.reload();
                }
            });
	});

	$("#april-fools-day-edit-youtube-user").click(function(event) {
		event.preventDefault();
			var userid;

		if(!$("#youtube-stats-header-country").text())
			$("#youtube-stats-header-country").text("US");

		if(!$("#youtube-stats-header-channeltype").text())
			$("#youtube-stats-header-channeltype").text("Games");

		 $.post( "/js/class/core", function( data ) {
			userid = data;
			if(userid > 0) {	// LOGGED IN
				var afdcountry = $("#youtube-stats-header-country").text();
				var afdchanneltype = $("#youtube-stats-header-channeltype").text();
				var afdtotalsubs = $("#youtube-stats-header-subs").text();
				var afdtotalviews = $("#youtube-stats-header-views").text();
				var afduploads = $("#youtube-stats-header-uploads").text();

				var afdmincpm = $("#afd-header-cpm-low").text();
				var afdmaxcpm = $("#afd-header-cpm-high").text();

				var totalgrade = $("#afd-header-total-grade").text();
				var subsrank = $("#afd-header-subscriber-rank").text();
				subsrank = subsrank.replace(/\D/g,'');

				var videoviewrank = $("#afd-header-videoview-rank").text();
				videoviewrank = videoviewrank.replace(/\D/g,'');

				var sbrank = $("#afd-header-sb-rank").text();
				sbrank = sbrank.replace(/\D/g,'');

				var views30 = $("#afd-header-views-30d").text();
				views30 = views30.replace(/[^\d.-]/g, '');
				var subs30 = $("#afd-header-subs-30d").text();
				subs30 = subs30.replace(/[^\d.-]/g, '');
				var views30p = $("#afd-header-views-30d-perc").text();
				views30p = views30p.replace(/[^\d.-]/g, '');
				var subs30p = $("#afd-header-subs-30d-perc").text();
				subs30p = subs30p.replace(/[^\d.-]/g, '');

				$('#afd-country-select option[value='+afdcountry+']').prop('selected', 'selected').change();
				$('#afd-channeltype-select option[value='+afdchanneltype+']').prop('selected', 'selected').change();

				$("#afd-total-subscribers").val(afdtotalsubs);
				$("#afd-total-video-views").val(afdtotalviews);
				$("#afd-uploaded-videos").val(afduploads);
				$("#afd-total-grade").val(totalgrade);
				if($("#afd-header-grade-text").text().length > 0) {
					$("#afd-total-grade").val($("#afd-header-grade-text").text());
					color = $("#afd-header-grade-color").text();
					gradecolor = $('#afd-color-grade').val();

					if(color == "#b30f0f") { gradecolor = "red";  }
					else if(color == "#b3350f") { gradecolor = "red-orange"; }
					else if(color == "#e07400") { gradecolor = "orange";  }
					else if(color == "#e09e00") { gradecolor = "yellow-orange";  }
					else if(color == "#e0ce00") { gradecolor = "yellow";  }
					else if(color == "#b3e000") { gradecolor = "yellow-green";  }
					else if(color == "#7fe000") { gradecolor = "green";  }
					else if(color == "#22c402") { gradecolor = "deep-green";  }
					else if(color == "#10c2dd") { gradecolor = "light-blue";  }
					else if(color == "#006fa8") { gradecolor = "dark-blue";  }
					else if(color == "#1686c0") { gradecolor = "ocean-blue";  }
					else if(color == "#ae16c0") { gradecolor = "magenta";  }
					else if(color == "#e88fce") { gradecolor = "pink";  }
					else if(color == "#cc8fe8") { gradecolor = "purple";  }
					else if(color == "#222222") { gradecolor = "black";  }
					$('#afd-color-grade option[value='+gradecolor+']').prop('selected', 'selected').change();
				}


				$("#afd-subs-rank").val(subsrank);
				$("#afd-views-rank").val(videoviewrank);
				$("#afd-sb-rank").val(sbrank);

				$("#afd-views-30d").val(views30);
				$("#afd-subs-30d").val(subs30);


				$("#afd-views-30d-perc").val(views30p);
				$("#afd-subs-30d-perc").val(subs30p);

				$("#afd-min-CPM").val(afdmincpm);
				$("#afd-max-CPM").val(afdmaxcpm);

				$( "#dialog_edit_afd" ).dialog({
				  resizable: false,
				  height:500,
				  minWidth: 1050,
				  draggable: false,
				  modal: true,
				  closeText: "X",
				buttons: [ {
						text:
						"Save Profile",
						"class": 'ui-button-option2',
						click: function() {
							var isError = 0;

							// Country Check
							if(afdcountry.length != 2) { isError = 1; }
							if(!isNumeric(afdtotalsubs)) { isError = 1; }
							if(!isNumeric(afdtotalviews)) { isError = 1; }
							if(!isNumeric(afduploads)) { isError = 1; }
							if(!isNumeric(subsrank)) { isError = 1; }
							if(!isNumeric(videoviewrank)) { isError = 1; }
							if(!isNumeric(sbrank)) { isError = 1; }
							if(!isNumeric(views30)) { isError = 1; }
							if(!isNumeric(subs30)) { isError = 1; }
							if(!isNumeric(views30p)) { isError = 1; }
							if(!isNumeric(subs30p)) { isError = 1; }

							youtubeUsername = $("#afd-header-username").text();
							afdcountry = $('#afd-country-select').val();

							afdchanneltype = $('#afd-channeltype-select').val();
							totalgrade = $("#afd-total-grade").val();

							afdtotalsubs = $('#afd-total-subscribers').val();
							afdtotalviews = $('#afd-total-video-views').val();
							afduploads = $('#afd-uploaded-videos').val();
							subsrank = $("#afd-subs-rank").val();
							videoviewsrank = $("#afd-views-rank").val();
							sbrank = $("#afd-sb-rank").val();

							views30 = $("#afd-views-30d").val();
							subs30 = $("#afd-subs-30d").val();
							views30p = $("#afd-views-30d-perc").val();
							subs30p = $("#afd-subs-30d-perc").val();

							afdmincpm = $("#afd-min-CPM").val();
							afdmaxcpm = $("#afd-max-CPM").val();

							gradecolor = $('#afd-color-grade').val();

							// Are we going to have an issue?
							if(isError == 0) {
								$.post( "/js/class/afd/update-youtube", {
                                                                        gradecolor: gradecolor,
                                                                        username: youtubeUsername,
                                                                        country: afdcountry,
                                                                        channeltype: afdchanneltype,
                                                                        totalgrade: totalgrade,
                                                                        totalsubs: afdtotalsubs,
                                                                        totalviews: afdtotalviews,
                                                                        uploads: afduploads,
                                                                        subsrank: subsrank,
                                                                        videoviewsrank: videoviewsrank,
                                                                        sbrank: sbrank,
                                                                        views30: views30,
                                                                        subs30: subs30,
                                                                        views30p: views30p,
                                                                        subs30p: subs30p,
                                                                        afdmincpm: afdmincpm,
                                                                        afdmaxcpm: afdmaxcpm,
                                                                    }, function( data ) {
                                                                    var response = data;

                                                                    if(response == "SUCCESS") {
                                                                            location.reload();
                                                                    }
								});
							}

					} }, {
						text: "Cancel",
						"class": 'ui-button-option2',
						click: function() {
								$(this).dialog("close");
					} },
					],
				});

			} else {			// NOT LOGGED IT
				$( "#dialog_edit_afdcheck" ).dialog({ resizable: false, modal: true, minWidth: 500,draggable: false,closeText: "X", });
			}
		});
	});

	$("#april-fools-day-top-user-bar-exit-no").click(function(event) {
		event.preventDefault();
		$("#april-fools-day-top-user-bar-exit").hide();
		$("#april-fools-day-top-user-bar").show();
	});

	$('#search-special').ddslick({
            width: 150,
            imagePosition: "left",
            background: "#444",
            onSelected: function(data){
                var valueSelected = data.selectedData.value;
                if(valueSelected == "youtube") {
                        $("#topSearchForm").attr("action", "/youtube/s/");
                        $("#SearchInput").attr("placeholder", "Enter YouTube Username").blur();

                } else if(valueSelected == "twitch") {
                        $("#topSearchForm").attr("action", "/twitch/search/");
                        $("#SearchInput").attr("placeholder", "Enter Twitch Username").blur();

                } else if(valueSelected == "instagram") {
                        $("#topSearchForm").attr("action", "/instagram/search/");
                        $("#SearchInput").attr("placeholder", "Enter Instagram Business Username").blur();

                } else if(valueSelected == "twitter") {
                        $("#topSearchForm").attr("action", "/twitter/search/");
                        $("#SearchInput").attr("placeholder", "Enter Twitter Username").blur();

                } else if(valueSelected == "dailymotion") {
                        $("#topSearchForm").attr("action", "/dailymotion/search/");
                        $("#SearchInput").attr("placeholder", "Enter Dailymotion Username").blur();

                } else if(valueSelected == "mixer") {
                        $("#topSearchForm").attr("action", "/mixer/search/");
                        $("#SearchInput").attr("placeholder", "Enter Mixer Username").blur();
                } else if(valueSelected == "facebook") {
                        $("#topSearchForm").attr("action", "/facebook/search/");
                        $("#SearchInput").attr("placeholder", "Enter Facebook Page Name").blur();
                } else {
                        $("#topSearchForm").attr("action", "/youtube/s/");
                        $("#SearchInput").attr("placeholder", "Enter YouTube Username").blur();
                }
            }
	});

	$(".btn_bookappointment").click(function(event) {
		event.preventDefault();
		setster_widget.show();
	});

	$("#streamClose").click(function() {
            //$("#streamVideo").hide();
            if($("#stream-options").is(":visible"))
                $("#stream-options").hide();
            else
                $("#stream-options").show();
            //$.cookie('SBStream', '0', { expires: 3, path: '/' });

        });

        $("#streamUnsnooze").click(function() {
            if($("#stream-unsnooze").is(":visible"))
                $("#stream-unsnooze").hide();
            else
                $("#stream-unsnooze").show();
        });

        $("#unsnooze").click(function() {
            $.post( "../../class/track-stream-clicks", { type: 0 });
            $.cookie('SBStream', null);
            $("#streamUnsnoozer").hide();
            $("#stream-options").hide();
            $("#streamVideo").show();
        });

        $("#snooze-1day").click(function() {
            $("#streamVideo").hide();
            $("#stream-unsnooze").hide();
            $("#streamUnsnoozer").show();
            $.post( "../../class/track-stream-clicks", { type: 1 });
            $.cookie('SBStream', '0', { expires: 1, path: '/' });
        });

        $("#snooze-3day").click(function() {
            $("#streamVideo").hide();
            $("#stream-unsnooze").hide();
            $("#streamUnsnoozer").show();
            $.post( "../../class/track-stream-clicks", { type: 3 });
            $.cookie('SBStream', '0', { expires: 3, path: '/' });
        });

        $("#snooze-7day").click(function() {
            $("#streamVideo").hide();
            $("#stream-unsnooze").hide();
            $("#streamUnsnoozer").show();
            $.post( "../../class/track-stream-clicks", { type: 7 });
            $.cookie('SBStream', '0', { expires: 7, path: '/' });
        });

        window.setTimeout( function() {
            var bottomad = $('#bottomAd');
            if (bottomad.length == 1) {
                if (bottomad.height() == 0) {
                    $(".socialblade-heartbeat").show();
                } else {
                    // NO BLOCK. THANK YOU FOR YOUR SUPPORT :3
                }
            }
         }, 100);


	$(".top-social-item,.top-menu-list").hover(function(){
		$(this).css("background-color","#c83a2c");

	},function(){
		$(this).css("background-color","#b3382c");
	});

    
    // Top Charts Menu Switcher
	$(".top-menu-category-button").click(function(event) {
		event.preventDefault();
        var obj = $(this).data();
        var type = obj["rolechange"];
        $(".top-menu-content").hide();
        $("#top-menu-content-"+type).show();
        
	});


	/* Clicks within the dropdown won't make
	   it past the dropdown itself */
	$("#top-menu-category-select").click(function(e){            
            e.preventDefault();
            
            if($("#top-menu-top-charts").is(":visible")) {                
                $("#top-menu-top-charts").slideUp(50);
		$("#top-menu-top-realtime").hide();
		$("#top-menu-top-platform").hide();
                e.stopPropagation();
            } else {
                $("#top-menu-top-charts").slideDown(50);
                $("#top-menu-top-realtime").hide();
		$("#top-menu-top-platform").hide();
                e.stopPropagation();		
	    }
	});
        
        $("#top-menu-realtime-select").click(function(e) {
            e.preventDefault();
            if($("#top-menu-top-realtime").is(":visible")) {        
                $("#top-menu-top-realtime").slideUp(50);
		$("#top-menu-top-platform").hide();
		$("#top-menu-top-charts").hide();
                e.stopPropagation();
            } else {               
                $("#top-menu-top-realtime").slideDown(50);   
		$("#top-menu-top-platform").hide();
		$("#top-menu-top-charts").hide();
                e.stopPropagation();
            }
        });        
        
        $("#top-menu-platform-select").click(function(e) {
            e.preventDefault();
            if($("#top-menu-top-platform").is(":visible")) {        
                $("#top-menu-top-platform").slideUp(50);
		$("#top-menu-top-realtime").hide();
		$("#top-menu-top-charts").hide();
                e.stopPropagation();
            } else {               
                $("#top-menu-top-platform").slideDown(50);   
		$("#top-menu-top-realtime").hide();
		$("#top-menu-top-charts").hide();
                e.stopPropagation();
            }
        }); 
	
        $("#compareUser1").keyup(function(e){
            if(e.keyCode == 13) {
                var compareclass = $(this).attr('class');
                var comparetype;
                if(compareclass == "compare-youtube-input")
                    comparetype = "youtube";
                if(compareclass == "compare-twitch-input")
                    comparetype = "twitch";
                if(compareclass == "compare-instagram-input")
                    comparetype = "instagram";
                if(compareclass == "compare-twitter-input")
                    comparetype = "twitter";
                submitCompare(comparetype);
            }
        });

        $("#compareUser2").keyup(function(e){
            if(e.keyCode == 13) {
                var compareclass = $(this).attr('class');
                var comparetype;
                if(compareclass == "compare-youtube-input")
                    comparetype = "youtube";
                if(compareclass == "compare-twitch-input")
                    comparetype = "twitch";
				if(compareclass == "compare-instagram-input")
					comparetype = "instagram";
                if(compareclass == "compare-twitter-input")
                    comparetype = "twitter";
                submitCompare(comparetype);
            }
        });

        $("#compareUser3").keyup(function(e){
            if(e.keyCode == 13) {
                var compareclass = $(this).attr('class');
                var comparetype;
                if(compareclass == "compare-youtube-input")
                    comparetype = "youtube";
                if(compareclass == "compare-twitch-input")
                    comparetype = "twitch";
				if(compareclass == "compare-instagram-input")
					comparetype = "instagram";
                if(compareclass == "compare-twitter-input")
                    comparetype = "twitter";
                submitCompare(comparetype);
            }
        });



        $("#compareYoutubeButton-Submit").click( function(event) {
            event.preventDefault();
            submitCompare("youtube");
        })

       $("#compareTwitchButton-Submit").click( function(event) {
            event.preventDefault();
            submitCompare("twitch");
        })


      $("#compareInstagramButton-Submit").click( function(event) {
            event.preventDefault();
            submitCompare("instagram");
        })


      $("#compareTwitterButton-Submit").click( function(event) {
            event.preventDefault();
            submitCompare("twitter");
        })

        function submitCompare(comparetype) {
			if($("#compareUser1").val().length == 24) {
				var user1 = $("#compareUser1").val();
			} else {
				var user1 = $("#compareUser1").val().toLowerCase();
			}

			if($("#compareUser2").val().length == 24) {
				var user2 = $("#compareUser2").val();
			} else {
				var user2 = $("#compareUser2").val().toLowerCase();
			}
			if($("#compareUser3").val().length == 24) {
				var user3 = $("#compareUser3").val();
			} else {
				var user3 = $("#compareUser3").val().toLowerCase();
			}
            var defaultPhrase = "enter youtube username";

            // comparetype = typeof comparetype !== 'undefined' ? comparetype : "youtube";

            if(comparetype == "youtube") {
                defaultPhrase = "enter youtube username";
            }
            else if(comparetype == "twitch") {
                defaultPhrase = "enter twitch username";
            }
            else if(comparetype == "instagram") {
                defaultPhrase = "enter instagram username";
            }
            if(user1 == defaultPhrase)
                user1 = "";
            if(user2 == defaultPhrase)
                user2 = "";
            if(user3 == defaultPhrase)
                user3 = "";

            if(user1 !== "")
                user1 = "/" + user1
            if(user2 !== "")
                user2 = "/" + user2
            if(user3 != "")
                user3 = "/" + user3


            // remove duplicates
            var usernames = [user1,user2,user3];
            var uniqueNames = [];
            $.each(usernames, function(i, el){
                if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
            });

            URL = "/" + comparetype + "/compare" + uniqueNames.join("")

            window.location.href = URL;
        }


	$(".activesection").hover(function(){
	$(this).css("background-color","#efefef");

	},function(){
		$(this).css("background-color","#e9e9e9");
	});

	$(".activemenutop").hover(function(){
	$(this).css("background-color","#333333");

	},function(){
		$(this).css("background-color","#444444");
	});


	$(".SocialButton").hover(function(){
		$(this).css("background-color","#ee9546");
		$(this).css("border-bottom-color","#ee9546");

	},function(){
		$(this).css("background-color","#e48531");
		$(this).css("border-bottom-color","#ce711e");
	});
	$(".OrangeButton").hover(function(){
		$(this).css("background-color","#ef631f");
		$(this).css("border-bottom-color","#ef631f");

	},function(){
		$(this).css("background-color","#d5410d");
		$(this).css("border-bottom-color","#bf3200");
	});

	$(".BlueButton").hover(function(){
		$(this).css("background-color","#24c9f3");
		$(this).css("border-bottom-color","#008aac");

	},function(){
		$(this).css("background-color","#13bae4");
		$(this).css("border-bottom-color","#08a8d0");
	});

	$('#CountrySelectorSidebar').change(function() {
		var SelectedCountry = $('#CountrySelectorSidebar :selected').val();

		 if(SelectedCountry == "default")
			return
		else {
            var select_type = "youtube";
            //
            if(URL[1] == "youtube") { select_type = "youtube"; } 
            else if(URL[1] == "dailymotion") { select_type = "dailymotion"; }
            else { select_type = "youtube;" }
            
            window.location = '/'+select_type+'/top/country/'+SelectedCountry;
        }
			
	});

	$('.socialShareIcon').hover(function(){
		$(this).css("opacity", "1.0");
	},function(){
		$(this).css("opacity","0.5");
	});




        // COMPARE SWITCH

	$("#compare-user-button").hover(function(){
		$(this).css("background-color","#a76dc8");
	},function(){
		$(this).css("background-color","#83549f");
	});


        $("#dailyvideoviewsYTDYGraph").hide();
        $("#videoviewsYTDYGraph").hide();
        $("#futureviewsYTDYGraph").hide();
	$("#compareYoutubeButton-Submit").hover(function(){
		$(this).css("background-color","#27bee4");

	},function(){
		$(this).css("background-color","#08a8d0");
	});

        $("#compare-switch-views").click(function() {
            $( this ).css( "background-color", "#dddddd" );
            $("#compare-switch-subs").css( "background-color", "#eeeeee" );
            $("#subscribersYTDYGraph").hide();
            $("#videoviewsYTDYGraph").show();
        });

        $("#compare-switch-subs").click(function() {
            $( this ).css( "background-color", "#dddddd" );
            $("#compare-switch-views").css( "background-color", "#eeeeee" );
            $("#videoviewsYTDYGraph").hide();
            $("#subscribersYTDYGraph").show();
        });

        $("#compare-switch-daily-views").click(function() {
            $( this ).css( "background-color", "#dddddd" );
            $("#compare-switch-daily-subs").css( "background-color", "#eeeeee" );
            $("#dailysubscribersYTDYGraph").hide();
            $("#dailyvideoviewsYTDYGraph").show();
        });

        $("#compare-switch-daily-subs").click(function() {
            $( this ).css( "background-color", "#dddddd" );
            $("#compare-switch-daily-views").css( "background-color", "#eeeeee" );
            $("#dailyvideoviewsYTDYGraph").hide();
            $("#dailysubscribersYTDYGraph").show();
        });
        $("#compare-switch-future-views").click(function() {
            $( this ).css( "background-color", "#dddddd" );
            $("#compare-switch-future-subs").css( "background-color", "#eeeeee" );
            $("#futuresubsYTDYGraph").hide();
            $("#futureviewsYTDYGraph").show();
        });

        $("#compare-switch-future-subs").click(function() {
            $( this ).css( "background-color", "#dddddd" );
            $("#compare-switch-future-views").css( "background-color", "#eeeeee" );
            $("#futureviewsYTDYGraph").hide();
            $("#futuresubsYTDYGraph").show();
        });


	if($('.sponsoredSideVideo').length > 0) {
		var currentId = $('.sponsoredSideVideo').attr('id');
		GetLatestSponsoredVideo(currentId);
	}

        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/')+1);

        if(filename == "youtube-money-calculator") {
            if($("#calc-user").length > 0 ) {
            if($("#calc-user").val() != "Would you like to Input a YouTube Username? (Optional)")
                trackUser();
            }


            calcValue();
            var Link = $.noUiSlider.Link;


            $("#calc-user-button").click(function() {
              trackUser();
            });

            $('#cpm-range-slider').noUiSlider({
                    start: [ 0.25, 4.00 ],
                    step: 0.05,
                    range: {
                        'min': [ 0.10 ],
                        '50%': [   1, 0.10 ],
                        '70%': [   5, 0.20 ],
                        'max': [ 10 ]
                    },
                serialization: {
                    lower: [
                            new Link({
                                    target: $('#min-cpm-range-value')
                            })
                    ],
                    upper: [
                            new Link({
                                    target: $('#max-cpm-range-value')
                            })
                    ],
                    format: {
                            decimals: 2,
                            mark: '.'
                    }
                }
            });
            $("#view-range-slider").noUiSlider({
                start: [ 1000 ],
                step: 5,
                connect: "lower",

                range: {
                    'min': [ 0 ],
                    '30%': [   5000, 500 ],
                    '50%': [   100000, 2000 ],
                    '80%': [  1000000, 10000 ],
                    'max': [ 4000000 ]
                },
                serialization: {
                    lower: [
                            new Link({
                                    target: $('#calc-daily-views')
                            })
                    ],
                    format: {
                            decimals: 0,
                            mark: '.'
                    }
                }
            });

            $("#calc-daily-views").blur(function () {
                calcValue();
            });
            $('#view-range-slider').on('set', function(){
                calcValue();
            });

            $('#cpm-range-slider').on('set', function(){
                calcValue();
            });

        }



    if(URL[1] == "youtube" && !URL[4]) {
            if(URL[2] == "user" || URL[2] == "channel" || URL[2] == "c") {
                    var videoid = $("#youtube-summary-recent-video").attr('class');
                    $("#youtube-summary-recent-video").hover(function() {
                            DirectURL = '<iframe width="498px" height="280px" src="//www.youtube.com/embed/'+videoid+'" frameborder="0" allowfullscreen></iframe>';
                            $(this).html(DirectURL);
                            $(this).unbind("mouseenter mouseleave");
                    });
            }
    }

    if(URL[1] == "youtube" && URL[4] == "videos") {
            if(URL[2] == "user" || URL[2] == "channel" || URL[2] == "c" || URL[2] == "user2") {
                    if(!URL[5]) {	// RECENT
                            var channelid = $("#YouTube-Video-Wrap").attr('class');
		
                            $.post( "/js/class/youtube-video-recent", { channelid:channelid }, function( data ) {
                                    var response = JSON.parse(data);

                                    var minCPM = 0.5;
                                    var maxCPM = 4.0;
                                    var countrycode = "$";
                                    var countryvalue = 1;

                                    for (var i = 0; i < response.length; i++) {
                                            // CHANGE BG COLOR OF ROWS
                                            if(i % 2 == 0) bgcolor = "#fafafa";
                                            else bgcolor = "#f8f8f8;";

                                            var videoID = response[i]["videoId"];
                                            var title = response[i]["title"];
                                            var created_at = response[i]["created_at"];
                                            var videoURL = "https://www.youtube.com/watch?v="+response[i]["videoId"];

                                            var views = response[i]["views"];
                                            var minEarned = ((views/1000)*minCPM).toFixed(2);
                                            var maxEarned = ((views/1000)*maxCPM).toFixed(2);

                                            var rating = response[i]["rating"];
                                            var ratings = response[i]["ratings"];
											if(rating != "nan") {
												rating = RatingPercent(rating);
											} else {
												rating = "";
											}
                                            var comments = response[i]["comments"];

                                            var vidstringlen = title.length;
                                            if(vidstringlen > 55)
                                                    title = title.substring(0,53) + "...";

                                            $("#YouTube-Video-Wrap").append(' \
                                                    <div id = "" class = "RowRecentTable" style = "width: 880px;">\
                                                    <div class ="TableMonthlyStats" style ="width: 80px; padding: 5px 2px; background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+created_at+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 370px; padding: 5px 0px;  background: '+bgcolor+'; border-bottom: 1px solid #eee; font-size: 9pt;"><a href = "'+videoURL+'" target = "_BLANK" rel="nofollow" style = "text-decoration: none;">'+title+'</a></div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+n_format(views, 1)+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+n_format(ratings)+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+rating+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 95px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;"><a href = "//www.youtube.com/all_comments?v='+videoID+'" target = "_BLANK">'+n_format(comments)+'</a></div> \
                                                    <div class ="TableMonthlyStats" style ="width: 135px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+money(n_format(minEarned,1,countryvalue),countrycode)+' - '+money(n_format(maxEarned,1),countrycode,countryvalue)+'</div> \
                                                    </div> \
                                            ');

                                    }
                            });
                    } else if(URL[5] == "mostviewed") {
                            var channelid = $("#YouTube-Video-Wrap").attr('class');
                            $.post( "/js/class/youtube-video-mostviewed", { channelid:channelid }, function( data ) {
                                    var response = JSON.parse(data);

                                    var minCPM = 0.5;
                                    var maxCPM = 4.0;
                                    var countrycode = "$";
                                    var countryvalue = 1;

                                    var videolength = response.length;
                                    if(videolength > 45)
                                            videolength = 45;

                                    for (var i = 0; i < videolength; i++) {
                                            // CHANGE BG COLOR OF ROWS
                                            if(response[i]["videoId"] == null) {
                                            } else {
                                                if(i % 2 == 0) bgcolor = "#fafafa";
                                                else bgcolor = "#f8f8f8;";

                                                var videoID = response[i]["videoId"];
                                                var title = response[i]["title"];
                                                var created_at = response[i]["created_at"];
                                                var videoURL = "https://www.youtube.com/watch?v="+response[i]["videoId"];

                                                var views = response[i]["views"];
                                                //console.log(views);
                                                var minEarned = ((views/1000)*minCPM).toFixed(2);
                                                var maxEarned = ((views/1000)*maxCPM).toFixed(2);

                                                var rating = response[i]["rating"];
                                                var ratings = response[i]["ratings"];
                                                var comments = response[i]["comments"];

                                                var vidstringlen = title.length;
                                                if(vidstringlen > 55)
                                                                title = title.substring(0,53) + "...";

                                                $("#YouTube-Video-Wrap").append(' \
                                                        <div id = "" class = "RowRecentTable" style = "width: 880px;">\
                                                        <div class ="TableMonthlyStats" style ="width: 80px; padding: 5px 2px; background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+created_at+'</div> \
                                                        <div class ="TableMonthlyStats" style ="width: 370px; padding: 5px 0px;  background: '+bgcolor+'; border-bottom: 1px solid #eee; font-size: 9pt;"><a href = "'+videoURL+'" target = "_BLANK" rel="nofollow" style = "text-decoration: none;">'+title+'</a></div> \
                                                        <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+n_format(views, 1)+'</div> \
                                                        <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+n_format(ratings)+'</div> \
                                                        <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+RatingPercent(rating)+'</div> \
                                                        <div class ="TableMonthlyStats" style ="width: 95px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;"><a href = "//www.youtube.com/all_comments?v='+videoID+'" target = "_BLANK">'+n_format(comments)+'</a></div> \
                                                        <div class ="TableMonthlyStats" style ="width: 135px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+money(n_format(minEarned,1,countryvalue),countrycode)+' - '+money(n_format(maxEarned,1),countrycode,countryvalue)+'</div> \
                                                        </div> \
                                                ');

                                            }

                                    }
                            });
                    } else if(URL[5] == "highestrated") {
                            var channelid = $("#YouTube-Video-Wrap").attr('class');
                            $.post( "/js/class/youtube-video-highestrated", { channelid:channelid }, function( data ) {
                                    var response = JSON.parse(data);
                                    var minCPM = 0.5;
                                    var maxCPM = 4.0;
                                    var countrycode = "$";
                                    var countryvalue = 1;

                                    var videolength = response.length;
                                    if(videolength > 45)
                                            videolength = 45;

                                    for (var i = 0; i < videolength; i++) {
                                            // CHANGE BG COLOR OF ROWS
                                            if(i % 2 == 0) bgcolor = "#fafafa";
                                            else bgcolor = "#f8f8f8;";

                                            var videoID = response[i]["videoId"];
                                            var title = response[i]["title"];
                                            var created_at = response[i]["created_at"];
                                            var videoURL = "https://www.youtube.com/watch?v="+response[i]["videoId"];

                                            var views = response[i]["views"];
                                            var minEarned = ((views/1000)*minCPM).toFixed(2);
                                            var maxEarned = ((views/1000)*maxCPM).toFixed(2);

                                            var rating = response[i]["rating"];
                                            var ratings = response[i]["ratings"];
                                            var comments = response[i]["comments"];

                                            var vidstringlen = title.length;
                                            if(vidstringlen > 55)
                                                    title = title.substring(0,53) + "...";

                                            $("#YouTube-Video-Wrap").append(' \
                                                    <div id = "" class = "RowRecentTable" style = "width: 880px;">\
                                                    <div class ="TableMonthlyStats" style ="width: 80px; padding: 5px 2px; background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+created_at+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 370px; padding: 5px 0px;  background: '+bgcolor+'; border-bottom: 1px solid #eee; font-size: 9pt;"><a href = "'+videoURL+'" target = "_BLANK" rel="nofollow" style = "text-decoration: none;">'+title+'</a></div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+n_format(views, 1)+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+n_format(ratings)+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+RatingPercent(rating)+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 95px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;"><a href = "//www.youtube.com/all_comments?v='+videoID+'" target = "_BLANK">'+n_format(comments)+'</a></div> \
                                                    <div class ="TableMonthlyStats" style ="width: 135px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+money(n_format(minEarned,1,countryvalue),countrycode)+' - '+money(n_format(maxEarned,1),countrycode,countryvalue)+'</div> \
                                                    </div> \
                                            ');

                                    }
                            });
                    } else if(URL[5] == "relevant") {
                            var channelid = $("#YouTube-Video-Wrap").attr('class');
                            $.post( "/js/class/youtube-video-relevant", { channelid:channelid }, function( data ) {
                                    var response = JSON.parse(data);

                                    var minCPM = 0.5;
                                    var maxCPM = 4.0;
                                    var countrycode = "$";
                                    var countryvalue = 1;

                                    var videolength = response.length;
                                    if(videolength > 45)
                                            videolength = 45;

                                    for (var i = 0; i < videolength; i++) {
                                            // CHANGE BG COLOR OF ROWS
                                            if(i % 2 == 0) bgcolor = "#fafafa";
                                            else bgcolor = "#f8f8f8;";

                                            var videoID = response[i]["videoId"];
                                            var title = response[i]["title"];
                                            var created_at = response[i]["created_at"];
                                            var videoURL = "https://www.youtube.com/watch?v="+response[i]["videoId"];

                                            var views = response[i]["views"];
                                            var minEarned = ((views/1000)*minCPM).toFixed(2);
                                            var maxEarned = ((views/1000)*maxCPM).toFixed(2);

                                            var rating = response[i]["rating"];
                                            var ratings = response[i]["ratings"];
                                            var comments = response[i]["comments"];

                                            var vidstringlen = title.length;
                                            if(vidstringlen > 55)
                                                    title = title.substring(0,53) + "...";

                                            $("#YouTube-Video-Wrap").append(' \
                                                    <div id = "" class = "RowRecentTable" style = "width: 880px;">\
                                                    <div class ="TableMonthlyStats" style ="width: 80px; padding: 5px 2px; background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+created_at+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 370px; padding: 5px 0px;  background: '+bgcolor+'; border-bottom: 1px solid #eee; font-size: 9pt;"><a href = "'+videoURL+'" target = "_BLANK" rel="nofollow" style = "text-decoration: none;">'+title+'</a></div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+n_format(views, 1)+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+n_format(ratings)+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 65px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+RatingPercent(rating)+'</div> \
                                                    <div class ="TableMonthlyStats" style ="width: 95px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;"><a href = "//www.youtube.com/all_comments?v='+videoID+'" target = "_BLANK">'+n_format(comments)+'</a></div> \
                                                    <div class ="TableMonthlyStats" style ="width: 135px; padding: 5px 0px;  background: '+bgcolor+'; font-size: 9pt; border-bottom: 1px solid #eee;">'+money(n_format(minEarned,1,countryvalue),countrycode)+' - '+money(n_format(maxEarned,1),countrycode,countryvalue)+'</div> \
                                                    </div> \
                                            ');

                                    }
                            });
                    }

            }
    }



    if(URL[1] == "dashboard" || URL[1] == "account") {
            $("#dashboard-displayname-skip").click(function(event) {
				event.preventDefault();
				var action = "skip"
				var displayname = "";
				$.post( "/js/class/dashboard-display-name", { action:action, displayname:displayname }, function( data ) {
					var response = data;
					if(response == "SUCCESS") {
							location.reload();
					}
				});
            });
            $("#dashboard-displayname-set").click(function(event) {
				event.preventDefault();
				var action = "set"
				var displayname = $("#dashboard-display-name-input").val();
				var security_token = $("#display_name_u_id").val();
				$.post( "/js/class/dashboard-display-name", { action:action, displayname:displayname, security_token:security_token }, function( data ) {
					var response = data;
					console.log(response);
					if(response == "SUCCESS") {
							location.reload();
					} else {
						if(response == "ERROR-TOKEN") {
							location.reload();
						}
					}
				});
            });
    }


	/***************
	FAVORITES
	***************/

    // GRAB PAGE TYPE
    if(URL[1] == "youtube" && URL[2] == "user") {
        favtype = "youtube";
    } else if(URL[1] == "twitch" && URL[2] == "user") {
        favtype = "twitch";
    } else if(URL[1] == "instagram" && URL[2] == "user") {
        favtype = "instagram";
    } else if(URL[1] == "twitter" && URL[2] == "user") {
        favtype = "twitter";
    } else if(URL[1] == "dailymotion" && URL[2] == "user") {
        favtype = "dailymotion";
    } else if(URL[1] == "mixer" && URL[2] == "user") {
        favtype = "mixer";
    } else if(URL[1] == "facebook" && URL[2] == "page") {
        favtype = "facebook";
    }

    if(URL[1] == "youtube" && URL[2] == "channel" || URL[2] == "c") {
        favtype = "youtube";
    }

    // CHECK IF PAGE IS A VALID USER PAGE
    if((URL[1] == "youtube" || URL[1] == "twitch" || URL[1] == "instagram" || URL[1] == "dailymotion" || URL[1] == "twitter" || URL[1] == "mixer") && URL[2] == "user") {
        isUserPage = 1;
    }
    // CHECK IF PAGE IS A VALID USER PAGE
    if((URL[1] == "youtube" || URL[1] == "twitch" || URL[1] == "instagram" || URL[1] == "dailymotion" || URL[1] == "twitter" || URL[1] == "mixer") && URL[2] == "channel") {
        isUserPage = 1;
    }

    if(URL[1] == "facebook" && URL[2] == "page") {
        isUserPage = 1;
    }

	if(URL[4] == "realtime") {
		isUserPage = 0;
	}
    
    $("#close-error-notification").click(function(event) {
        event.preventDefault();
        $(this).parent().hide(100);
    });

    if(isUserPage == 1) {
         var userid;
        $.post( "/js/class/core", function( data ) {
            userid = data;
            if(userid > 0) {
                var username = $('#fav-bubble').attr('class');
                var usertype = $('#fav-bubble').children(0).attr('id');
                var typeid;
                var pagetype = "user";
                pagetype = URL[2];
                
                if(!usertype) {
                    // DO NOTHING
                } else {
                    usertype = usertype.replace("fav-", "")

                    if(usertype == "youtube") {
                        typeid = 0;
                    } else if(usertype == "twitch") {
                        typeid = 1;
                    } else if(usertype == "instagram") {
                        typeid = 2;
                    } else if(usertype == "twitter") {
                        typeid = 3;
                    } else if(usertype == "dailymotion") {
                        typeid = 4;
                    } else if(usertype == "mixer") {
                        typeid = 5;
                    } else if(usertype == "facebook") {
                        typeid = 6;
                    }
                    // Check if Favorite Exists, then opposite it and return data
                    $.post( "/js/class/favorite-check", { id: userid, name: username, type: usertype, pagetype:pagetype }, function( data ) {
			
                    var response = JSON.parse(data);
                    var isFound = 0;

                    for(i = 0; i < Object.keys(response).length; i++) {
                        if(username == response[i]["username"] && typeid == response[i]["type"]) {
                            isFound = 1;
                        }
                    }
                        
                    if(isFound == 1) {
                        if(usertype == "twitch") {
                            $('#fav-bubble').children(0).attr('class', "fa fa-heart fa-1x").css( "color", "#b3382c" );
                        } else {
                            $('#fav-bubble').children(0).attr('class', "fa fa-heart fa-2x").css( "color", "#b3382c" );
                        }
                        
                    } else {
                        if(usertype == "twitch") {
                            $('#fav-bubble').children(0).attr('class', "fa fa-heart-o fa-1x").css( "color", "#999" );
                        } else {
                            $('#fav-bubble').children(0).attr('class', "fa fa-heart-o fa-2x").css( "color", "#999" );
                        }                        
                        
                    }

                    });                    
                }

            }
         });
    }

    $("#fav-bubble").click(function() {
        // GET USERID
        var userid;
        
        $.post( "/js/class/core", function( data ) {
             userid = data;
            if(userid > 0) {
                var username = $('#fav-bubble').attr('class');
                var usertype = $('#fav-bubble').children(0).attr('id');
                var security_token = $('#fav-security-token').text();
                var typeid;
                var pagetype = "user";
                pagetype = URL[2];
                usertype = usertype.replace("fav-", "")

                if(usertype == "youtube") {
                    typeid = 0;
                } else if(usertype == "twitch") {
                    typeid = 1;
                } else if(usertype == "instagram") {
                    typeid = 2;
                } else if(usertype == "twitter") {
                    typeid = 3;
                } else if(usertype == "dailymotion") {
                    typeid = 4;
                } else if(usertype == "mixer") {
                    typeid = 5;
                } else if(usertype == "facebook") {
                    typeid = 6;
                }


                // Check if Favorite Exists, then opposite it and return data
                $.post( "/js/class/favorite-update", { id: userid, name: username, type: typeid, pagetype:pagetype, security_token:security_token }, function( data ) {
                var response = data;
                var favtype = $('#fav-bubble').children(0).attr('class');

                if(response == 1) {
                    if(favtype == "fa fa-heart-o fa-2x")
                        $('#fav-bubble').children(0).attr('class', "fa fa-heart fa-2x").css( "color", "#b3382c" );
                    if(favtype == "fa fa-heart-o fa-1x")
                        $('#fav-bubble').children(0).attr('class', "fa fa-heart fa-1x").css( "color", "#b3382c" );                    
                } else if (response == 2) {
                    if(favtype == "fa fa-heart fa-2x")
                        $('#fav-bubble').children(0).attr('class', "fa fa-heart-o fa-2x").css( "color", "#999" );
                    if(favtype == "fa fa-heart fa-1x")
                        $('#fav-bubble').children(0).attr('class', "fa fa-heart-o fa-1x").css( "color", "#999" );                    
                } else if(response == 3) {
                    toastr.clear();
                    toastr["error"]("You have reached your favorite limit for this account type");
                }

                });
            } else {
                $( "#dialog_favorite_logincheck" ).dialog({ resizable: false, modal: true, minWidth: 500,draggable: false,closeText: "X", });
            }
        });


    });

	if(URL[1] == "admin") {

		setInterval(function(){
			$.post( "/js/class/system-statistics", { userid: userid }, function( data ) {
				var response = JSON.parse(data);
				console.log();

				$("#dashboard-visitors-on-site").text(number_format(response["visitors"]["chartbeat"]["visits"]));
				$("#dashboard-visitors-on-site").css("color", visitorColor(response["visitors"]["chartbeat"]["visits"]));

				$("#load-average-1").text(response["cpu"]["load"])
				$("#load-average-1").css("color", loadColor(response["cpu"]["load"]));

				function loadColor(num) {
					if(num > 120) {
						return "#cc2323"; }
					else if(num > 85) {
						return "#cc4323"; }
					else if(num > 65) {
						return "#cc7723"; }
					else if(num > 35) {
						return "#ccaa23"; }
					else if(num > 22){
						return "#bacc23"; }
					else if(num > 10) {
						return "#92cc23"; }
					else if(num > 0) {
						return "#5fcc23"; }
					else {
						return "#666666"; }
				}

				function visitorColor(num) {
					if(num > 2000) {
						return "#23cacc"; }
					else if(num > 1800) {
						return "#23cc6b"; }
					else if(num > 1600) {
						return "#3fcc23"; }
					else if(num > 1400) {
						return "#92cc23"; }
					else if(num > 1200) {
						return "#ccb623"; }
					else if(num > 900){
						return "#cc9a23"; }
					else if(num > 700) {
						return "#cc6b23"; }
					else if(num > 400) {
						return "#cc4f23"; }
					else {
						return "#666666"; }
				}

			});
		}, 5000);

	}

    if(URL[1] == "favorites") {
        var data = new Array();
        var favarrYT = new Array();
        var favYTname = new Array();
        var favarrTW = new Array();
        var favarrIG = new Array();
        var favarrT = new Array();
        var favarrDM = new Array();
        var favarrMIXER = new Array();
        var favarrFB = new Array();

        var user_data = [];

        $("#fav-select-all").click(function(event) {
            event.preventDefault();
            $('.fav-checkbox').prop('checked', true);
            if(URL[2] == "youtube") {
               favarrYT = new Array();
               $( ".fav-checkbox" ).each(function( index ) {
                    var favid = $(this).attr("id");
                    favid = favid.replace("fav-checkbox-id-", "");
                    favarrYT.push(favid);
                    checknumfav(favarrYT, "youtube");
                });
                updategraphstate(favarrYT, "youtube")
            }
            if(URL[2] == "twitch") {
               favarrTW = new Array();
               $( ".fav-checkbox" ).each(function( index ) {
                    var favid = $(this).attr("id").toLowerCase();
                    favid = favid.replace("fav-checkbox-id-", "");
                    favarrTW.push(favid);
                    checknumfav(favarrTW, "twitch");
                });
                updategraphstate(favarrTW, "twitch")
            }
            if(URL[2] == "instagram") {
               favarrIG = new Array();
               $( ".fav-checkbox" ).each(function( index ) {
                    var favid = $(this).attr("id").toLowerCase();
                    favid = favid.replace("fav-checkbox-id-", "");
                    favarrIG.push(favid);
                    checknumfav(favarrIG, "instagram");
                });
                updategraphstate(favarrIG, "instagram")
            }
            if(URL[2] == "twitter") {
               favarrT = new Array();
               $( ".fav-checkbox" ).each(function( index ) {
                    var favid = $(this).attr("id").toLowerCase();
                    favid = favid.replace("fav-checkbox-id-", "");
                    favarrT.push(favid);
                    checknumfav(favarrT, "twitter");
                });
                updategraphstate(favarrT, "twitter")
            }
	        if(URL[2] == "dailymotion") {
               favarrDM = new Array();
               $( ".fav-checkbox" ).each(function( index ) {
                    var favid = $(this).attr("id").toLowerCase();
                    favid = favid.replace("fav-checkbox-id-", "");
                    favarrDM.push(favid);
                    checknumfav(favarrDM, "dailymotion");
                });
                updategraphstate(favarrDM, "dailymotion")
            }
	        if(URL[2] == "mixer") {
                favarrMIXER = new Array();
                $( ".fav-checkbox" ).each(function( index ) {
                     var favid = $(this).attr("id").toLowerCase();
                     console.log(favid);
                     favid = favid.replace("fav-checkbox-id-", "");
                     favarrMIXER.push(favid);
                     checknumfav(favarrMIXER, "mixer");
                 });
                 updategraphstate(favarrMIXER, "mixer")
             }	  
             if(URL[2] == "facebook") {
                favarrFB = new Array();
                $( ".fav-checkbox" ).each(function( index ) {
                     var favid = $(this).attr("id").toLowerCase();
                     console.log(favid);
                     favid = favid.replace("fav-checkbox-id-", "");
                     favarrFB.push(favid);
                     checknumfav(favarrFB, "facebook");
                 });
                 updategraphstate(favarrFB, "facebook")
             }	                       	    
        });

        $("#fav-remove-selected").click(function(event) {
            event.preventDefault();
			var security_token = $("#fav-security-token").text();			
            var favdelete = new Array();
            $( ".fav-checkbox" ).each(function( index ) {
                if ($(this).is(':checked')) {
                    var favid = $(this).attr("id");
                    favid = favid.replace("fav-checkbox-id-", "");
                    favdelete.push(favid);
                }
            });

            if(favdelete.length != 0) {
                var username = favdelete.toString();
                var userid = $("#fav-remove-selected").parent().attr('class');

                var favtype;
                if(URL[2] == "youtube") { favtype = 0; }
                if(URL[2] == "twitch") { favtype = 1; }
                if(URL[2] == "instagram") { favtype = 2; }
                if(URL[2] == "twitter") { favtype = 3; }
                if(URL[2] == "dailymotion") { favtype = 4; }
                if(URL[2] == "mixer") { favtype = 5; }
                if(URL[2] == "facebook") { favtype = 6; }


                $.post( "/js/class/favorite-singular", { username: username, favtype: favtype, action: "remove-selected", userid: userid, security_token:security_token}, function( data ) {
                    var response = data;
                    if(response == "ERROR") {
                        location.reload();
                    }
                    if(response == "SUCCESS") {
                        location.reload();
                    }
                });

            }
        });

        $("#fav-unselect-all").click(function(event) {
            event.preventDefault();
            $('.fav-checkbox').prop('checked', false);
            favarrYT = new Array();
            favYTname = new Array();
            favarrTW = new Array();
            favarrIG = new Array();
            favarrT = new Array();
            favarrDM = new Array();
            favarrMIXER = new Array();
            favarrFB = new Array();

            if(URL[2] == "youtube") { checknumfav(favarrYT, "youtube"); }
            if(URL[2] == "twitch") { checknumfav(favarrTW, "favarrYT1twitch"); }
            if(URL[2] == "instagram") { checknumfav(favarrIG, "instagram"); }
            if(URL[2] == "twitter") { checknumfav(favarrT, "twitter"); }
            if(URL[2] == "dailymotion") { checknumfav(favarrDM, "dailymotion"); }
            if(URL[2] == "mixer") { checknumfav(favarrMIXER, "mixer"); }
            if(URL[2] == "facebook") { checknumfav(favarrMIXER, "facebook"); }
        });

        $(".fav-checkbox").change(function() {
            var favid = $(this).attr("id");
            
            favid = favid.replace("fav-checkbox-id-", "");

            if(this.checked) {  // CHECK A FAV
                if(URL[2] == "youtube") { var displayname = encodeURIComponent($(this).data("displayname")); favarrYT.push(favid); favYTname.push(displayname); checknumfav(favarrYT, "youtube"); updategraphstate(favarrYT, "youtube", favYTname); console.log(favarrYT); }
                if(URL[2] == "twitch") { favarrTW.push(favid); checknumfav(favarrTW, "twitch");  updategraphstate(favarrTW, "twitch"); }
                if(URL[2] == "instagram") { favarrIG.push(favid); checknumfav(favarrIG, "instagram");  updategraphstate(favarrIG, "instagram"); }
                if(URL[2] == "twitter") { favarrT.push(favid); checknumfav(favarrT, "twitter");  updategraphstate(favarrT, "twitter"); }
                if(URL[2] == "dailymotion") { favarrDM.push(favid); checknumfav(favarrDM, "dailymotion");  updategraphstate(favarrDM, "dailymotion"); }
                if(URL[2] == "mixer") { favarrMIXER.push(favid); checknumfav(favarrMIXER, "mixer");  updategraphstate(favarrMIXER, "mixer"); }
                if(URL[2] == "facebook") { favarrFB.push(favid); checknumfav(favarrFB, "mixer");  updategraphstate(favarrFB, "facebook"); }

            } else { // UNCHECK A FAV
                if(URL[2] == "youtube") { var displayname = encodeURIComponent($(this).data("displayname")); removeItem(favarrYT, favid); removeItem(favYTname, displayname); checknumfav(favarrYT); updategraphstate(favarrYT, "youtube", favYTname);
                    if(favarrYT.length == 0) { $('.favorite-graph-overlay').hide();  }
                }
                if(URL[2] == "twitch") { removeItem(favarrTW, favid); checknumfav(favarrTW); updategraphstate(favarrTW, "twitch");
                    if(favarrTW.length == 0) { $('.favorite-graph-overlay').hide(); }
                }
                if(URL[2] == "instagram") { removeItem(favarrIG, favid);checknumfav(favarrIG);  updategraphstate(favarrIG, "instagram");
                    if(favarrIG.length == 0) { $('.favorite-graph-overlay').hide(); }
                }
                if(URL[2] == "twitter") { removeItem(favarrT, favid);checknumfav(favarrT);  updategraphstate(favarrT, "twitter");
                    if(favarrT.length == 0) { $('.favorite-graph-overlay').hide(); }
                }
                if(URL[2] == "dailymotion") { removeItem(favarrDM, favid);checknumfav(favarrDM);  updategraphstate(favarrDM, "dailymotion");
                    if(favarrDM.length == 0) { $('.favorite-graph-overlay').hide(); }
                }
                if(URL[2] == "mixer") { removeItem(favarrMIXER, favid);checknumfav(favarrMIXER);  updategraphstate(favarrMIXER, "mixer");
                    if(favarrMIXER.length == 0) { $('.favorite-graph-overlay').hide(); }
                }        
                if(URL[2] == "facebook") { removeItem(favarrFB, favid);checknumfav(favarrFB);  updategraphstate(favarrFB, "facebook");
                    if(favarrFB.length == 0) { $('.favorite-graph-overlay').hide(); }
                }                                        	
            }

        });

        function updategraphstate(arr,type, displayname) {
            var names = arr.toString();

            if(typeof displyname !== "undefined") {
                var displaynames = displayname.toString();    
            }
            
            var date = [];
            var subs = [];
            var views = [];
            var name = [];

            
            
            var z_subs;
            var z_views;

            var maxdays = 30;
            for(i = 0; i < arr.length; i++) {
                var data = $(jq(arr[i])).text();
                data = JSON.parse(data);

                user_data[arr[i]] = data;
                
				// console.log(data)
            }
            
            if(typeof displaynames != "undefined") {
                names = displaynames;
            }

            // CALCULATE THE DATA
            z_subs = '"Date, '+names+' \n';
			z_views = '"Date, '+names+' \n';


            for(var z = 0; z < (maxdays); z++) {

                var inner_count = 0;

                for(aa = 0; aa < arr.length; aa++) {
                    // console.log(user_data[arr[z]]);

                    if(inner_count == 0) {
                        z_subs += user_data[arr[aa]][z]["date"];
                        z_views += user_data[arr[aa]][z]["date"];

                    }
                    z_subs += ', '+user_data[arr[aa]][z]["subs"] + '"';
                    z_views += ', '+user_data[arr[aa]][z]["views"]+ '"';
                }

                if(z == (maxdays-1)) {
                    z_subs += '\n';
                    z_views += '\n';
                } else {
                    z_subs += ' + \n';
                    z_views += ' + \n';
                }
            }
                $('.favorite-graph-overlay').show();

                if(type == "youtube") {
                    var YTTotalSubs = new Dygraph(document.getElementById("dygraph-youtube-favorite-dashboard-total-subs"),
                    // CSV or path to a CSV file.
                    z_subs, {
                        legend: 'always',
                        titleHeight: 45,
                        ylabel: 'Total Subs',
                        digitsAfterDecimal: 3,
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true,
                        maxNumberWidth: 11
                        }
                    );

                    var YTTotalViews = new Dygraph(document.getElementById("dygraph-youtube-favorite-dashboard-total-views"),
                    // CSV or path to a CSV file.
                    z_views, {
                        legend: 'always', titleHeight: 45, ylabel: 'Total Views',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        digitsAfterDecimal: 3,
                        strokeWidth: 1.5,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true, maxNumberWidth: 11
                        }
                    );
                }

                if(type == "twitch") {
                    var TWTotalFollowers = new Dygraph(document.getElementById("dygraph-twitch-favorite-dashboard-total-followers"),
                    // CSV or path to a CSV file.
                    z_subs, {
                        legend: 'always',
                        titleHeight: 45,
                        ylabel: 'Total Followers',
                        digitsAfterDecimal: 3,
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true,
                        maxNumberWidth: 11
                        }
                    );

                    var TWTotalViews = new Dygraph(document.getElementById("dygraph-twitch-favorite-dashboard-total-views"),
                    // CSV or path to a CSV file.
                    z_views, {
                        legend: 'always', titleHeight: 45, ylabel: 'Total Views',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true, maxNumberWidth: 11
                        }
                    );
                }
                if(type == "instagram") {
                    var IGTotalFollowers = new Dygraph(document.getElementById("dygraph-instagram-favorite-dashboard-total-followers"),
                    // CSV or path to a CSV file.
                    z_subs, {
                        legend: 'always',
                        titleHeight: 45,
                        ylabel: 'Total Followers',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true,
                        maxNumberWidth: 11
                        }
                    );

                    var IGTotalViews = new Dygraph(document.getElementById("dygraph-instagram-favorite-dashboard-total-following"),
                    // CSV or path to a CSV file.
                    z_views, {
                        legend: 'always', titleHeight: 45, ylabel: 'Total Following User',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true, maxNumberWidth: 11
                        }
                    );
                }
              if(type == "twitter") {
                    var TwitterTotalFollowers = new Dygraph(document.getElementById("dygraph-twitter-favorite-dashboard-total-followers"),
                    // CSV or path to a CSV file.
                    z_subs, {
                        legend: 'always',
                        titleHeight: 45,
                        ylabel: 'Total Followers',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true,
                        maxNumberWidth: 11
                        }
                    );

                    var TwitterTotalViews = new Dygraph(document.getElementById("dygraph-twitter-favorite-dashboard-total-following"),
                    // CSV or path to a CSV file.
                    z_views, {
                        legend: 'always', titleHeight: 45, ylabel: 'Total Following User',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true, maxNumberWidth: 11
                        }
                    );
                }
                if(type == "dailymotion") {
                    var DailymotionTotalFollowers = new Dygraph(document.getElementById("dygraph-dailymotion-favorite-dashboard-total-followers"),
                    // CSV or path to a CSV file.
                    z_subs, {
                        legend: 'always',
                        titleHeight: 45,
                        ylabel: 'Total Followers',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true,
                        maxNumberWidth: 11
                        }
                    );

                    var DailymotionTotalViews = new Dygraph(document.getElementById("dygraph-dailymotion-favorite-dashboard-total-views"),
                    // CSV or path to a CSV file.
                    z_views, {
                        legend: 'always', titleHeight: 45, ylabel: 'Total Video Views',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true, maxNumberWidth: 11
                        }
                    );
                }	
                if(type == "mixer") {
                    var MixerTotalFollowers = new Dygraph(document.getElementById("dygraph-mixer-favorite-dashboard-total-followers"),
                    // CSV or path to a CSV file.
                    z_subs, {
                        legend: 'always',
                        titleHeight: 45,
                        ylabel: 'Total Followers',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true,
                        maxNumberWidth: 11
                        }
                    );

                    var MixerTotalViews = new Dygraph(document.getElementById("dygraph-mixer-favorite-dashboard-total-views"),
                    // CSV or path to a CSV file.
                    z_views, {
                        legend: 'always', titleHeight: 45, ylabel: 'Total Video Views',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true, maxNumberWidth: 11
                        }
                    );
                }	                	
                if(type == "facebook") {
                    var FacebookTotalFollowers = new Dygraph(document.getElementById("dygraph-facebook-favorite-dashboard-total-followers"),
                    // CSV or path to a CSV file.
                    z_subs, {
                        legend: 'always',
                        titleHeight: 45,
                        ylabel: 'Total Likes',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true,
                        maxNumberWidth: 11
                        }
                    );

                    var FacebookTotalViews = new Dygraph(document.getElementById("dygraph-facebook-favorite-dashboard-total-views"),
                    // CSV or path to a CSV file.
                    z_views, {
                        legend: 'always', titleHeight: 45, ylabel: 'Talking About',
                        labelsDivStyles: { 'background': 'none', 'margin-top': '380px', 'text-align': 'right', 'font-size': '8pt', },
                        labelsDivWidth: 1250,
                        strokeWidth: 1.5,
                        digitsAfterDecimal: 3,
                        colors: ["#73000d", "#9c33cc", "#00d2e6", "#e5001b", "#120d33", "#00bf9c", "#403034", "#010059", "#b6f2d7", "#e5738f", "#0400d9", "#3df288", "#f2005d", "#99a6cc", "#20331a", "#33001a", "#809fff", "#134d00", "#99004f", "#0062ff", "#6aa629", "#e639a9", "#0056a6", "#7df200", "#664d60", "#002940", "#545943", "#d9a3cd", "#609ebf", "#a2a67c", "#581a66", "#396e73"],
                        labelsKMB: true, maxNumberWidth: 11
                        }
                    );
                }	 		

        }

        function checknumfav(arr) {
            // HIDE OR DISPLAY GRAPH IF ENOUGH USERS ARE PRESENT
            if(arr.length == 1) {
                $(".fav-graph-header").show();
                $(".favorite-dashboard-graph").show();
            }
            if(arr.length == 0) {
                $(".fav-graph-header").hide();
                $(".favorite-dashboard-graph").hide();
                $('.favorite-graph-overlay').hide();
            }

        }

        $('#fav-section-user').keypress(function (e) {
            if (e.which == 13) {
              $("#fav-section-add-user").click();
            }
          });

        $("#fav-section-add-user").click(function(event) {
            event.preventDefault(); // PREVENT & CONTINUE
            var username = $("#fav-section-user").val();
	        var security_token = $("#fav-security-token").text();
            var userid = $("#fav-section-user").attr('class');
            var favtype;
            if(URL[2] == "youtube") { favtype = 0; }
            if(URL[2] == "twitch") { favtype = 1; }
            if(URL[2] == "instagram") { favtype = 2; }
            if(URL[2] == "twitter") { favtype = 3; }	    
            if(URL[2] == "dailymotion") { favtype = 4; }
            if(URL[2] == "mixer") { favtype = 5; }
            if(URL[2] == "facebook") { favtype = 6; }

            if($("#fav-section-user").val().length > 0 && $("#fav-section-user").val() != "Enter Username") {

                $.post( "/js/class/favorite-singular", { username: username, favtype: favtype, action: "add-username", userid: userid, security_token:security_token }, function( data ) {
                        var response = data;
                        if(response == "ERROR") {
                            location.reload();
                        }
                        if(response == "SUCCESS") {
                            location.reload();
                        }
                    });

            } else {
                // Nothing Written in the Username Field
                return;
            }
            //console.log($("#fav-section-user").val());
        });
    }

	if(URL[1] == "products" || URL[1] == "products2") {
            
                $(document).keypress(function(e) {
                    if(e.which == 13) {
                        if(e.target.id == "SearchInput") {
                            
                        } else {
                            event.preventDefault();
                        }
                        
                    }
                });            
            
		if(URL[2] == "captions") {
			$("#management-captions-calculate").click(function(event) {
				event.preventDefault(); // PREVENT & CONTINUE
				var videoURL = $("#management-captions-video").val();
				var result = checkURL(videoURL);

				// Is URL?
				if(result == true) {

				} else {
					if($("#management-captions-error").is(":visible"))
						return;
					else {
						$("#management-captions-error").fadeIn(200);
						$("#management-captions-error").delay(2500).queue(function(nxt) {
							$("#management-captions-error").fadeOut(200);
							nxt();
						});
					}
				}
			});
		}
		if(URL[2] == "management") {
			$(".channel-management-purchase").click(function(event) {
				event.preventDefault(); // PREVENT & CONTINUE
				var id = $(this).attr('id');
				var isError = 0;

				if(id == "management-purchase-grow") {
					$("#management-ongoing-package").val("1");
					$("#management-package-span").text("GROW");
				} else if(id == "management-purchase-connect") {
					$("#management-ongoing-package").val("2");
					$("#management-package-span").text("CONNECT");
				} else if(id == "management-purchase-conquer") {
					$("#management-ongoing-package").val("3");
					$("#management-package-span").text("CONQUER");
				} else {
					isError = 1;
				}

				if(isError == 0) {
					$("#channel-management-page-1").hide();
					$(window).scrollTop(0);

					$("#channel-management-page-2").show();
				}
			});

			$("#management-purchase-return").click(function(event) {
				event.preventDefault(); // PREVENT & CONTINUE
				$("#channel-management-page-2").hide();
				$(window).scrollTop(0);
				$("#channel-management-page-1").show();
			});

			$("#management-purchase-confirm").click(function(event) {
				event.preventDefault(); // PREVENT & CONTINUE
				var isError = 0;
				var userid = $("#management-ongoing-identify").val();
				var skype = $("#management-ongoing-skype").val();
				var channel = $("#management-ongoing-youtubechannel").val();
				var product = $("#management-ongoing-package").val();
				var additional = $("#management-onetime-additional-notes").val();
				var radio = $(".channel-management-terms-radio").attr('id');
				if(radio == "channel-management-terms-off") {
					isError = 1;
				} else {
					isError = 0;
				}

				if($("#management-ongoing-package").val().length > 0 && skype.length > 0 && channel.length > 0 && isError == 0) {
					$.post( "/js/class/management-ongoing-purchase", { userid: userid, skype:skype, channel:channel, product:product, additional:additional }, function( data ) {
						var response = JSON.parse(data);
						if(product == 1) {
							$("#payment_cost_ongoing").val(2000);
						}

						if(product == 2) {
							$("#payment_cost_ongoing").val(2500);
						}

						if(product == 3) {
							$("#payment_cost_ongoing").val(3000);
						}

						if(response == "SUCCESS") {
							$("#paypal_form_ongoing").submit();
						}
					});
				}
			});

			$(".channel-management-terms-radio").click(function(event) {
				event.preventDefault(); // PREVENT & CONTINUE
				var id = $(this).attr('id');
				if(id == "channel-management-terms-off") {
					$("#channel-manage-radio-unchecked").hide();
					$("#channel-manage-radio-checked").show();
					$(this).attr("id","channel-management-terms-on");
				} else {
					$("#channel-manage-radio-checked").hide();
					$("#channel-manage-radio-unchecked").show();
					$(this).attr("id","channel-management-terms-off");
				}



			});
		}
	}

    if(URL[1] == "products" || URL[1] == "products2") {
		if(URL[2] == "branding") {
			$(".management-selection-radio").mouseenter(function() {
				$(this).css({ "background-color": "#f3f3f3"});
			});
			$(".management-selection-radio").mouseleave(function() {
			   $(this).css({ "background-color": "#fafafa"});
			});
			$(".management-selection-radio").click(function(event) {
				event.preventDefault(); // PREVENT & CONTINUE
				var value = $(this).children(0).children(1).attr('class');
				if(value == "fa fa-square-o") {
					$( this ).children().eq(0).children().eq(0).attr('class', 'fa fa-check-square');
					$( this ).children().eq(1).children().eq(0).css('color', '#444');
					$( this ).children().eq(0).children().eq(1).text("1");
				} else {
					$( this ).children().eq(0).children().eq(0).attr('class', 'fa fa-square-o');
					$( this ).children().eq(1).children().eq(0).css('color', '#777');
					$( this ).children().eq(0).children().eq(1).text("0");
				}
				calculateOneTime();

			});

			$("#management-one-time-coupon-code").click( function(event) {
				event.preventDefault(); // PREVENT & CONTINUE
				var coupon = $("#management-one-time-coupon-field").val();
				var userid = $("#management-one-time-purchase").parent().attr('id');
				var product1 = $("#management-branding-intro").text();
				var product2 = $("#management-branding-watermark").text();
				var product3 = $("#management-channel-art").text();
				var product4 = $("#management-endslate-outro").text();

				var cost = 0;

				if(product1 == 1) { cost += 35; }
				if(product2 == 1) { cost += 25; }
				if(product3 == 1) { cost += 100; }
				if(product4 == 1) { cost += 50; }

				var skype = $("#management-onetime-skype").text();
				var channel = $("#management-onetime-youtubechannel").text();

				if(coupon.length > 0 && cost > 0) {
					$.post( "/js/class/product-management-onetime", { userid: userid, coupon: coupon, product1: product1, product2: product2, product3: product3, product4: product4, skype: skype, channel: channel, action: 0 }, function( data ) {
						var response = JSON.parse(data);
						if(response[0] == "SUCCESS") {
							if(response[1] == "ACTION_NONE") {
								// FULL SUCCESS, BUT TAKE NO ACTION
								var curr_cost = $("#management-one-total-cost").text();
								$("#management-one-total-cost").text(response[2].toFixed(2));
								var saved_cost = curr_cost - response[2];
								$("#management-one-total-deducted").text(saved_cost.toFixed(2));
								$("#management-one-total-deducted").parent().show(100);
								$("#management-one-time-coupon-code").parent().hide();
							}
						}
					});
				}
			});

			$("#management-one-time-purchase").click(function (event) {
				event.preventDefault(); // PREVENT & CONTINUE
				var coupon = $("#management-one-time-coupon-field").val();
				var userid = $("#management-one-time-purchase").parent().attr('id');
				var product1 = $("#management-branding-intro").text();
				var product2 = $("#management-branding-watermark").text();
				var product3 = $("#management-channel-art").text();
				var product4 = $("#management-endslate-outro").text();
				console.log($("#management-onetime-additional-notes").val());
				var cost = 0;

				if(product1 == 1) { cost += 35; }
				if(product2 == 1) { cost += 25; }
				if(product3 == 1) { cost += 100; }
				if(product4 == 1) { cost += 50; }

				var skype = $("#management-onetime-skype").val();
				var channel = $("#management-onetime-youtubechannel").val();
				if(cost > 0 && skype.length > 0 && channel.length > 0) {
					$("#P2-Skype-Username").text($("#management-onetime-skype").val());
					$("#P2-Channel-Page-URL").text($("#management-onetime-youtubechannel").val());
					$("#P2-Cost").val(cost);
					$("#products-query-instagram-page-1").hide();
					$(window).scrollTop(0);
					$("#products-query-instagram-page-2").show();
				}

			});

			$("#management-one-time-purchase-2").click(function(event) {
				event.preventDefault(); // PREVENT & CONTINUE
				var coupon = $("#management-one-time-coupon-field").val();
				var userid = $("#management-one-time-purchase").parent().attr('id');
				var product1 = $("#management-branding-intro").text();
				var product2 = $("#management-branding-watermark").text();
				var product3 = $("#management-channel-art").text();
				var product4 = $("#management-endslate-outro").text();
				var additional = $("#management-onetime-additional-notes").val();

				var cost = 0;

				if(product1 == 1) { cost += 35; }
				if(product2 == 1) { cost += 25; }
				if(product3 == 1) { cost += 100; }
				if(product4 == 1) { cost += 50; }

				var skype = $("#P2-Skype-Username").text();
				var channel = $("#P2-Channel-Page-URL").text();

				$("#payment_cost").val($("#management-one-total-cost").text());

				$.post( "/js/class/management-onetime-purchase", { userid: userid, coupon: coupon, product1: product1, product2: product2, product3: product3, product4: product4, skype: skype, channel: channel, cost: cost, additional:additional }, function( data ) {
					var response = JSON.parse(data);
					if(response == "SUCCESS") {

						$("#paypal_form").submit();
					}
				});

			});

			function calculateOneTime() {
				var product1 = $("#management-branding-intro").text();
				var product2 = $("#management-branding-watermark").text();
				var product3 = $("#management-channel-art").text();
				var product4 = $("#management-endslate-outro").text();

				var cost = 0;

				if(product1 == 1) { cost += 35; }
				if(product2 == 1) { cost += 25; }
				if(product3 == 1) { cost += 100; }
				if(product4 == 1) { cost += 50; }
				$("#management-one-total-deducted").parent().hide(100);
				$("#management-one-total-deducted").text(0);
				$("#management-one-time-coupon-code").parent().show();
				$("#management-one-total-cost").text(cost.toFixed(2));

			};


		}

        if(URL[3] == "youtube") {

            var max_users = $("#youtube-query-max-users").text();

            $("#query-youtube-order").click(function(event) {
                event.preventDefault(); // PREVENT & CONTINUE

                var security_token = $("#security_token").val();
				
                var usercount = USER_COUNT;
                var subrange = $( "#youtube-query-subscriptionrange" ).val();

                var totalsubmin = $("#youtube-query-sub-min").val();
                var totalsubmax = $("#youtube-query-sub-max").val();
                var totalviewmin = $("#youtube-query-view-min").val();
                var totalviewmax = $("#youtube-query-view-max").val();
                var avgsubmin = $("#youtube-query-avgsub-min").val();
                var avgsubmax = $("#youtube-query-avgsub-max").val();
                var avgviewmin = $("#youtube-query-avgview-min").val();
                var avgviewmax = $("#youtube-query-avgview-max").val();
                var tag_list = $("#reports_input").text();
                var location = $("#geo_loc_reports").val();

                var network = $("#youtube-query-networkcheck").val();
                var network_specific = $("#youtube-query-network-specific").val();

                var channeltype = $("#youtube-query-channeltype").val();
                var country = $( "#youtube-query-country" ).val();
                var sortby = $("#youtube-query-sortby").val();
                var data_dump = $("#youtube-query-data-dump").val();
                $("#button-order-query").text("Processing ... (Please Wait)");
                if(usercount != 0) {

                    $.post( "/js/class/product-query-youtube-user", { usercount: usercount, avgsubmin: avgsubmin, location:location, tag_list:tag_list, avgsubmax: avgsubmax, avgviewmin: avgviewmin, avgviewmax: avgviewmax, totalsubmin: totalsubmin, totalsubmax: totalsubmax, totalviewmin: totalviewmin, totalviewmax: totalviewmax, countryid: country, network: network, channeltype: channeltype, sortby: sortby, network_specific:network_specific, data_dump:data_dump, security_token:security_token }, function( data ) {

                        var response = data;
                        if(response == "ERROR") {
                            window.location.href = "/reports";
                        }

                        if(response == "SUCCESS") {
                            window.location.href = "/reports";
                        }
						
                        if(response == "INVALID-TOKEN") {
                                $("#button-order-query").text("REVIEW AND CALCULATE QUERY");
                                toastr["error"]("There is a security token mismatch for this action", "Security Warning");
                        }
                    });

                }
            })
            function calculate_estimate() {
                var E_COST = BASE_COST;
                if(NETWORK_CHECK == 1)
                    E_COST += 0.01;
                if(CHANNELTYPE_CHECK == 1)
                    E_COST += 0.01;
                if(COUNTRY_CHECK == 1)
                    E_COST += 0.01;
                if(SUBRANGE_CHECK == 1)
                    E_COST += 0.01;
                var COST = E_COST * USER_COUNT;
                $("#query-youtube-estimated-total").text("$" + COST.toFixed(2));
            }
            // DEFINE DATA MEMBERS
            var BASE_COST = 0.05;
            var USER_COUNT = 1000;
            var NETWORK_CHECK = 0;
            var CHANNELTYPE_CHECK = 0;
            var COUNTRY_CHECK = 0;
            var SUBRANGE_CHECK = 0;

            // BASE CALCULATE
            calculate_estimate();


            // USER COUNT
            $( "#query-youtube-usercount" ).slider({
              range: "min",
              value: 1000,
              min: 100,
              max: max_users, //max_users,
              step: 100,
              slide: function( event, ui ) {
                $( "#product-query-youtube-usercount" ).text( number_format(ui.value));
                USER_COUNT = ui.value;
                $("#product-query-youtube-usercount-raw").val(ui.value);
              },
              change: function(event, ui) {
                calculate_estimate()
              }
            });
            $( "#product-query-youtube-usercount" ).text( $( "#query-youtube-usercount" ).slider( "value" ) );
            $("#product-query-youtube-usercount-raw").val( $( "#query-youtube-usercount" ).slider( "value" ) );


            // CHECK NETWORK
            $("#youtube-query-networkcheck").change(function() {
                if($("#youtube-query-networkcheck").val() == "na") {
                    NETWORK_CHECK = 0;
                } else {
                    NETWORK_CHECK = 1;
                }
                calculate_estimate();
            });

            // CHECK CHANNELTYPE
            $("#youtube-query-channeltype").change(function() {
                if($("#youtube-query-channeltype").val() == "na") {
                    CHANNELTYPE_CHECK = 0;
                } else {
                    CHANNELTYPE_CHECK = 1;
                }
                calculate_estimate();
            });

            // CHECK COUNTRYTYPE
            $("#youtube-query-country").change(function() {
                if($("#youtube-query-country").val() == "na") {
                    COUNTRY_CHECK = 0;
                } else {
                    COUNTRY_CHECK = 1;
                }
                calculate_estimate();
            });

            // CHECK SUBSCRIPTION RANGE
            $("#youtube-query-subscriptionrange").change(function() {
                if($("#youtube-query-subscriptionrange").val() == "na") {
                    SUBRANGE_CHECK = 0;
                } else {
                    SUBRANGE_CHECK = 1;
                }
                calculate_estimate();
            });



        }   // END YOUTUBE
        if(URL[3] == "twitch") {

            // DEFINE DATA MEMBERS
            var BASE_COST = 0.05;
            var USER_COUNT = 500;
            var GAME_CHECK = 0;
			var max_users = $("#twitch-query-max-users").text();
            $("#query-twitch-order").click(function(event) {
                event.preventDefault(); // PREVENT & CONTINUE

                var security_token = $("#security_token").val();	
                
                var usercount = USER_COUNT;
                var subrange = $( "#youtube-query-subscriptionrange" ).val();

                var totalsubmin = $("#twitch-query-sub-min").val();
                var totalsubmax = $("#twitch-query-sub-max").val();
                var totalviewmin = $("#twitch-query-view-min").val();
                var totalviewmax = $("#twitch-query-view-max").val();
                var avgsubmin = $("#twitch-query-avgsub-min").val();
                var avgsubmax = $("#twitch-query-avgsub-max").val();
                var avgviewmin = $("#twitch-query-avgview-min").val();
                var avgviewmax = $("#twitch-query-avgview-max").val();
                var location = $("#geo_loc_reports").val();
                var tag_list = $("#reports_input").text();


                var game = $("#twitch-query-gamename").val();
                var sortby = $("#twitch-query-sortby").val();

                if($("#twitch-query-gamename").val() == "") {
                    GAME_CHECK = 0;
                } else {
                    GAME_CHECK = 1;
                }

                calculate_estimate();

                $("#button-order-query").text("Processing ... (Please Wait)");
                if(usercount != 0) {
                    $.post( "/js/class/product-query-twitch-user", { usercount: usercount, location:location, avgsubmin: avgsubmin, tag_list:tag_list, avgsubmax: avgsubmax, avgviewmin: avgviewmin, avgviewmax: avgviewmax, totalsubmin: totalsubmin, totalsubmax: totalsubmax, totalviewmin: totalviewmin, totalviewmax: totalviewmax, game:game, sortby:sortby, security_token:security_token }, function( data ) {
                        var response = data;
                        if(response == "ERROR") {
                            window.location.href = "/products/query";
                        }

                        if(response == "SUCCESS") {
                            window.location.href = "/reports";
                        }

                        if(response == "INVALID-TOKEN") {
                            $("#button-order-query").text("REVIEW AND CALCULATE QUERY");
                            toastr["error"]("There is a security token mismatch for this action", "Security Warning");
                        }						
                    });
                }
            })


            // USER COUNT
            $( "#query-twitch-usercount" ).slider({
              range: "min",
              value: 500,
              min: 100,
              max: max_users,
              step: 100,
              slide: function( event, ui ) {
                $( "#product-query-twitch-usercount" ).text( number_format(ui.value));
                USER_COUNT = ui.value;
                $("#product-query-twitch-usercount-raw").val(ui.value);
              },
              change: function(event, ui) {
                calculate_estimate()
              }
            });
            $( "#product-query-twitch-usercount" ).text( $( "#query-twitch-usercount" ).slider( "value" ) );
            $("#product-query-twitch-usercount-raw").val( $( "#query-twitch-usercount" ).slider( "value" ) );

            function calculate_estimate() {
                var E_COST = BASE_COST;
                if(GAME_CHECK == 1)
                    E_COST += 0.02;
                if(CHANNELTYPE_CHECK == 1)
                    E_COST += 0.02;
                if(COUNTRY_CHECK == 1)
                    E_COST += 0.03;
                if(SUBRANGE_CHECK == 1)
                    E_COST += 0.01;
                var COST = E_COST * USER_COUNT;
                $("#query-youtube-estimated-total").text("$" + COST.toFixed(2));

            }


        }   // END TWITCH
        if(URL[3] == "instagram") {
            var max_users = $("#instagram-query-max-users").text();


            // DEFINE DATA MEMBERS
            var BASE_COST = 0.05;
            var USER_COUNT = 500;
            var GAME_CHECK = 0;

            $("#query-instagram-order").click(function(event) {
                event.preventDefault(); // PREVENT & CONTINUE

                var security_token = $("#security_token").val();				
                var usercount = USER_COUNT;

                var totalsubmin = $("#instagram-query-sub-min").val();
                var totalsubmax = $("#instagram-query-sub-max").val();
                var totalviewmin = $("#instagram-query-view-min").val();
                var totalviewmax = $("#instagram-query-view-max").val();
                var avgsubmin = $("#instagram-query-avgsub-min").val();
                var avgsubmax = $("#instagram-query-avgsub-max").val();
                var avgviewmin = $("#instagram-query-avgview-min").val();
                var avgviewmax = $("#instagram-query-avgview-max").val();
                var mediamin = $("#instagram-query-media-min").val();
                var mediamax = $("#instagram-query-media-max").val();
                var location = $("#geo_loc_reports").val();
                var tag_list = $("#reports_input").text();
		var sortby = $("#instagram-query-sortby").val();

                calculate_estimate();

                $("#button-order-query").text("Processing ... (Please Wait)");
                if(usercount != 0) {

                $.post( "/js/class/product-query-instagram-user", { usercount: usercount, location:location, tag_list:tag_list, avgsubmin: avgsubmin, avgsubmax: avgsubmax, avgviewmin: avgviewmin, avgviewmax: avgviewmax, totalsubmin: totalsubmin, totalsubmax: totalsubmax, totalviewmin: totalviewmin, totalviewmax: totalviewmax, mediamin:mediamin, mediamax:mediamax, sortby:sortby, security_token:security_token }, function( data ) {
                    var response = data;
					
                    if(response == "ERROR") {
                        window.location.href = "/reports";
                    }

                    if(response == "SUCCESS") {
                        window.location.href = "/reports";
                    }

                    if(response == "INVALID-TOKEN") {
                            $("#button-order-query").text("REVIEW AND CALCULATE QUERY");
                            toastr["error"]("There is a security token mismatch for this action", "Security Warning");
                    }                    
                    
                });
                }
            })


            // USER COUNT
            $( "#query-instagram-usercount" ).slider({
              range: "min",
              value: 500,
              min: 100,
              max: max_users,
              step: 100,
              slide: function( event, ui ) {
                $( "#product-query-instagram-usercount" ).text( number_format(ui.value));
                USER_COUNT = ui.value;
                $("#product-query-instagram-usercount-raw").val(ui.value);
              },
              change: function(event, ui) {
                calculate_estimate()
              }
            });
            $( "#product-query-instagram-usercount" ).text( $( "#query-instagram-usercount" ).slider( "value" ) );
            $("#product-query-instagram-usercount-raw").val( $( "#query-instagram-usercount" ).slider( "value" ) );

            function calculate_estimate() {
                var E_COST = BASE_COST;
                if(GAME_CHECK == 1)
                    E_COST += 0.02;
                if(CHANNELTYPE_CHECK == 1)
                    E_COST += 0.02;
                if(COUNTRY_CHECK == 1)
                    E_COST += 0.03;
                if(SUBRANGE_CHECK == 1)
                    E_COST += 0.01;
                var COST = E_COST * USER_COUNT;
                $("#query-youtube-estimated-total").text("$" + COST.toFixed(2));

            }


        }   // END INSTAGRAM
        if(URL[3] == "twitter") {
            var max_users = $("#twitter-query-max-users").text();


            // DEFINE DATA MEMBERS
            var BASE_COST = 0.05;
            var USER_COUNT = 500;
            var GAME_CHECK = 0;

            $("#query-twitter-order").click(function(event) {
                event.preventDefault(); // PREVENT & CONTINUE

				var security_token = $("#security_token").val();						
				//var security_token = 1231213221;		
				
                var usercount = USER_COUNT;

                var totalsubmin = $("#twitter-query-sub-min").val();
                var totalsubmax = $("#twitter-query-sub-max").val();
                var totalviewmin = $("#twitter-query-view-min").val();
                var totalviewmax = $("#twitter-query-view-max").val();
                var avgsubmin = $("#twitter-query-avgsub-min").val();
                var avgsubmax = $("#twitter-query-avgsub-max").val();
                var avgviewmin = $("#twitter-query-avgview-min").val();
                var avgviewmax = $("#twitter-query-avgview-max").val();
                var mediamin = $("#twitter-query-media-min").val();
                var mediamax = $("#twitter-query-media-max").val();
                var avgrtmin = $("#twitter-query-avgrt-min").val();
                var avgrtmax = $("#twitter-query-avgrt-max").val();
                var avgfavmin = $("#twitter-query-avgfav-min").val();
                var avgfavmax = $("#twitter-query-avgfav-max").val();
                var location = $("#geo_loc_reports").val();
                var tag_list = $("#reports_input").text();
                var sortby = $("#twitter-query-sortby").val();

                calculate_estimate();

                $("#button-order-query").text("Processing ... (Please Wait)");
                if(usercount != 0) {

                    $.post( "/js/class/product-query-twitter-user", { usercount: usercount, location:location, tag_list: tag_list, avgsubmin: avgsubmin, avgsubmax: avgsubmax, avgviewmin: avgviewmin, avgviewmax: avgviewmax, totalsubmin: totalsubmin, totalsubmax: totalsubmax, totalviewmin: totalviewmin, totalviewmax: totalviewmax, mediamin:mediamin, mediamax:mediamax, avg_rt_min:avgrtmin, avg_rt_max:avgrtmax, avg_fav_min:avgfavmin, avg_fav_max:avgfavmax, sortby:sortby, security_token:security_token }, function( data ) {
                        var response = data;

                        if(response == "ERROR") {
                            window.location.href = "/products/query";
                        }

                        if(response == "SUCCESS") {
                          window.location.href = "/reports";
                        }

                        if(response == "INVALID-TOKEN") {
                            $("#button-order-query").text("REVIEW AND CALCULATE QUERY");
                            toastr["error"]("There is a security token mismatch for this action", "Security Warning");
                        }									
						
                    });
                }
            })


            // USER COUNT
            $( "#query-twitter-usercount" ).slider({
              range: "min",
              value: 500,
              min: 100,
              max: max_users,
              step: 100,
              slide: function( event, ui ) {
                $( "#product-query-twitter-usercount" ).text( number_format(ui.value));
                USER_COUNT = ui.value;
                $("#product-query-twitter-usercount-raw").val(ui.value);
              },
              change: function(event, ui) {
                calculate_estimate()
              }
            });
            $( "#product-query-twitter-usercount" ).text( $( "#query-twitter-usercount" ).slider( "value" ) );
            $("#product-query-twitter-usercount-raw").val( $( "#query-twitter-usercount" ).slider( "value" ) );

            function calculate_estimate() {
                var E_COST = BASE_COST;
                if(GAME_CHECK == 1)
                    E_COST += 0.02;
                if(CHANNELTYPE_CHECK == 1)
                    E_COST += 0.02;
                if(COUNTRY_CHECK == 1)
                    E_COST += 0.03;
                if(SUBRANGE_CHECK == 1)
                    E_COST += 0.01;
                var COST = E_COST * USER_COUNT;
                $("#query-youtube-estimated-total").text("$" + COST.toFixed(2));

            }


        }   // END TWITTER


    }
    if(URL[1] == "inbox") {

       // READ
        $(".markasread-inbox-module").click(function(event) {
            event.preventDefault(); // PREVENT & CONTINUE


            // GET ID
            var varid = $(this).attr("id");
            var varid_raw = $(this).attr("id");
            varid = varid.replace("markasread-inbox-module-", "");

            $("#notification-log-id-"+varid).remove();
            $(this).remove();

            $.post( "/js/class/notification-read", { id: varid}, function( data ) {
                var response = data;

                // UPDATE NUMBER
                if($("#notification-log-num").text() > 0) {
                    if($("#notification-log-num").text() > 1) {
                        var NUM = $("#notification-log-num").text();
                        $("#notification-log-num").text((NUM-1));
                    } else if($("#notification-log-num").text() == 1) {
                        var NUM = $("#notification-log-num").text();
                        $("#notification-log-num").text((NUM-1));
                        $("#notification-log-num").hide()

                    }
                }

                $(this).hide(300);
            });
        });


       // DELETE
        $(".delete-inbox-module").click(function(event) {
            event.preventDefault(); // PREVENT & CONTINUE


            // GET ID
            var varid = $(this).attr("id");
            var varid_raw = $(this).attr("id");
            varid = varid.replace("delete-inbox-module-", "");
            //console.log(varid);

            $.post( "/js/class/notification-delete", { id: varid}, function( data ) {
                var response = data;

                if(response == "SUCCESS") {
                    $("#delete-inbox-module-"+varid).parent().parent().hide(100);
                }
            });
        });



        $(".inbox-message-module").hover(function(){
            var original_color = $(this).css("background-color");
            $(this).css("background-color","#eeeeee");
            $(this).children("div").children(".markasread-inbox-module").show();
            $(this).children("div").children(".delete-inbox-module").show();
          },function(){
            $(this).css("background-color","#f8f8f8");
            $(this).children("div").children(".markasread-inbox-module").hide();
            $(this).children("div").children(".delete-inbox-module").hide();
        });


    }

    if(URL[1] == "reports") {

        $(".product-query-download").click(function(event) {
            event.preventDefault(); // PREVENT & CONTINUE

            var dlid = $(this).attr("id");
            dlid = dlid.replace("product-query-download-", "");
            $.post( "/js/class/product-query-download", { id: dlid}, function( data ) {
                var response = data;
            });

        });

        $(".product-query-delete").click(function(event) {
            event.preventDefault(); // PREVENT & CONTINUE

            // GET ID
			var security_token = $("#security_token").val();			
			
            var editid = $(this).children("a").attr("id");
            editid = editid.replace("product-query-delete-", "");
            var editobj = "product-query-delete-"+editid;
            editobj = $("#"+editobj).parent().parent().parent();

            $.post( "/js/class/product-query-delete", { id: editid, security_token:security_token}, function( data ) {
                var response = data;
				if(response == "INVALID-TOKEN") {					
					toastr["error"]("There is a security token mismatch for this action", "Security Warning");
				} else {
					$(editobj).hide(300);
				}
                
            });
        });

        $(".product-query-edit-title").click(function(event) {
            event.preventDefault(); // PREVENT & CONTINUE

            // GET ID
            var editid = $(this).children("a").attr("id");
            editid = editid.replace("product-query-edit-title-", "");


            var titlelink = "product-query-title-"+editid;
            var title = $("#"+titlelink);



            title = $("#"+titlelink).text();
            var originaltitle = title;


            var titleinputlink = titlelink;
            titleinputlink = titleinputlink.replace("product-query-title-", "product-query-input-title-");

            if($(this).children("a").text() == "Edit Title") {
                // EDIT
                $("#"+titlelink).hide()
                $("#"+titleinputlink).show()
                $(this).children("a").text('Save Title');
            } else {
                $("#"+titlelink).text($("#"+titleinputlink).val());
                title = $("#"+titlelink).text();

                if(title.length > 0 && originaltitle != title) {
                    $.post( "/js/class/product-query-changetitle", { title: title, id: editid}, function( data ) {
                        var response = data;
                    });

                    // SAVE
                    $("#"+titlelink).show()
                    $("#"+titleinputlink).hide();
                    $(this).children("a").text('Edit Title');
                } else {
                    $("#"+titlelink).show()
                    $("#"+titleinputlink).hide();
                    $(this).children("a").text('Edit Title');
                }
            }

        });

        $(".product-query-repurchase").click(function(event) {
            event.preventDefault(); // PREVENT & CONTINUE

            var repid = $(this).children("a").attr("id");
            $(this).children("a").text('Please Wait...');

            // Repurchase ID
            repid = repid.replace("product-query-repurchase-", "");

            $.post( "/js/class/product-query-repurchase", { repid: repid}, function( data ) {

                    window.location.href = "/reports";

            });
        });

        $("#report-filter-button").click(function(event) {
            event.preventDefault(); // PREVENT & CONTINUE
            if($(this).text() == "Show Criteria") {
                $(this).text("Hide Criteria");
                $("#report-info-filter")
                .stop()
                .css('opacity', 0)
                .slideDown('fast')
                .animate(
                  { opacity: 1 },
                  { queue: false, duration: 'fast' }
                );


            } else {
                $(this).text("Show Criteria");

                $("#report-info-filter")
                .stop()
                .css('opacity', 1)
                .slideUp('fast')
                .animate(
                  { opacity: 0 },
                  { queue: false, duration: 'fast' }
                );

            }
        });

    }

    if(filename == "account") {

        $("#reset-cpm-dashboard").click(function() {
            var mincpm = 0.25;
            var maxcpm = 4.00;
            $( "#youtube-minimum-cpm" ).text( "$" + mincpm.toFixed(2));
            $( "#youtube-maximum-cpm" ).text( "$" + maxcpm.toFixed(2));

            $("#youtube-min-cpm-value").val(mincpm.toFixed(2));
            $("#youtube-max-cpm-value").val(maxcpm.toFixed(2));
        });

        $( "#slider-cpm-youtube" ).slider({
                range: true,
                min: 0.05,
                max: 20.00,
                step: 0.05,
                values: [ $("#youtube-min-cpm-value").val(), $("#youtube-max-cpm-value").val() ],
                slide: function( event, ui ) {
                    $( "#youtube-minimum-cpm" ).text( "$" + ui.values[ 0 ].toFixed(2));
                    $( "#youtube-maximum-cpm" ).text( "$" + ui.values[ 1 ].toFixed(2));

                    $("#youtube-min-cpm-value").val(ui.values[0].toFixed(2));
                    $("#youtube-max-cpm-value").val(ui.values[1].toFixed(2));
                }
        });
        $( "#youtube-minimum-cpm" ).text( "$" + $( "#slider-cpm-youtube" ).slider( "values", 0 ).toFixed(2) );
        $( "#youtube-maximum-cpm" ).text( "$" + $( "#slider-cpm-youtube" ).slider( "values", 1 ).toFixed(2) );

		/*
		PROGRESS REPORTS
		 */

		var loadingMessages = [
			"Rallying the Troops",
			"Starting the Flux Capacitor",
			"Traveling through space and time",
			"Following the white rabbit",
			"Following The Yellow Brick Road",
			"Trying on the glass slipper"
		];

		$('#progressReports_OptIn').on("click", function() {
			var OptIn_Text = $('#progressReports_OptIn').text();
			$('#progressReports_OptIn').attr("disabled", "disabled").addClass("loading-ellipsis").text(loadingMessages[Math.floor(Math.random()*loadingMessages.length)]);

			$.ajax({
				url: '/js/class/progressReports',
				data: {'csrf': $('#display_name_u_id').val()},
				dataType: "json",
				success: function(json) {
					if(json.status == "200") {
						$('#progressReports_OptIn').removeClass("loading-ellipsis");
						$('#progressReports_OptIn_container').hide();
						$('#progressReports_Update_container').show();
						$('#progressReports_OptIn').text(OptIn_Text);
						$('#progressReports_OptIn').removeAttr("disabled");
					}
				}
			});
		});

		$('#progressReports_OptOut').on("click", function() {
			var OptOut_Text = $('#progressReports_OptOut').text();
			$('#progressReports_OptOut').attr("disabled", "disabled").addClass("loading-ellipsis").text(loadingMessages[Math.floor(Math.random()*loadingMessages.length)]);

			$.ajax({
				url: '/js/class/progressReports',
				data: {'csrf': $('#display_name_u_id').val(), 'mode': 'OptOut'},
				dataType: "json",
				success: function(json) {
					if(json.status == "200") {
						$('#progressReports_OptOut').removeClass("loading-ellipsis");
						$('#progressReports_Update_container').hide();
						$('#progressReports_OptIn_container').show();
						$('#progressReports_OptOut').text(OptOut_Text);
						$('#progressReports_OptOut').removeAttr("disabled");
					}
				}
			});
		});
    }
    
    
        

    $(document).click(function(){
	
	// HIDE MENU
	if (!$('#top-menu-top-charts').is(':hover')) {
	    $("#top-menu-top-charts").slideUp(50);
	}

	// HIDE REALTIME
	if (!$('#top-menu-top-realtime').is(':hover')) {
	    $("#top-menu-top-realtime").slideUp(50);
	}

	// HIDE PLATFORM
	if (!$('#top-menu-top-platform').is(':hover')) {
	    $("#top-menu-top-platform").slideUp(50);
	}	
	
    });	    
    
});
// END

function number_format( number, decimals, dec_point, thousands_sep ) {
    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 0 : decimals;
    var d = dec_point == undefined ? "." : dec_point;
    var t = thousands_sep == undefined ? "," : thousands_sep, s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
function is_numeric(mixed_var) {
   var whitespace =
    " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
  return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
    1)) && mixed_var !== '' && !isNaN(mixed_var);
}
function RatingPercent(x) {

	if(x > 95)
		return "<span style ='font-weight: bold; color:#00bee7;'>"+x+"%</span>";
	else if(x > 90)
		return "<span style ='font-weight: bold; color:#77ce10;'>"+x+"%</span>";
	else if(x > 80)
		return "<span style ='font-weight: bold; color:#f4ab0e;'>"+x+"%</span>";
	else if(x > 70)
		return "<span style ='font-weight: bold; color:#dd9700;'>"+x+"%</span>";
	else if(x > 60)
		return "<span style ='font-weight: bold; color:#c06800;'>"+x+"%</span>";
	else if(x > 50)
		return "<span style ='font-weight: bold; color:#935000;'>"+x+"%</span>";
	else if(x <= 50)
		return "<span style ='font-weight: bold; color:#c21d0c;'>"+x+"%</span>";
	else if(x == "n/a")
		return 0;
}

function n_format(n, dec, countryvalue) {
	var num;
	if(!dec)
		dec = 0;

	if (n < 1000) {
		// Anything less than a thousand
		num = number_format(n);
	} else if (n < 1000000) {
		// Anything less than a million
		num = number_format((n / 1000), dec) + 'K';
	} else if (n < 1000000000) {
		// Anything less than a billion
		num = number_format((n / 1000000), dec) + 'M';
	} else if (n < 10000000000) {
		// Anything less than a billion
		num = number_format((n / 1000000000), dec) + 'B';
	} else {
		// At least a Trillion
		num = number_format(n / 100000000000, dec) + 'T';
	}
	return num;
}

function getCode() { return $('#country-code').html(); }

function calcValue() {
    var views = $("#calc-daily-views").val();

        var minCPM = $('#min-cpm-range-value').text();
        var maxCPM = $('#max-cpm-range-value').text();

        if(minCPM.length == 0) {
            minCPM = 0.25;
            maxCPM = 4.00;
        }
        var tempView = parseFloat(views);
        var tempMinCPM = parseFloat(minCPM);
        var tempMaxCPM = parseFloat(maxCPM);

        if(tempMinCPM >= tempMaxCPM)
            tempMinCPM = tempMaxCPM;
        if(tempMaxCPM <= tempMinCPM)
            tempMinCPM = tempMaxCPM;

        var earningsLow = (tempView/1000)*tempMinCPM;
        var earningsHigh = (tempView/1000)*tempMaxCPM;



        $("#calc-user-min-cpm").text(number_format(earningsLow,2));
        $("#calc-user-max-cpm").text(number_format(earningsHigh,2));

        $("#calc-user-min-cpm-monthly").text(number_format((earningsLow*30),2));
        $("#calc-user-max-cpm-monthly").text(number_format((earningsHigh*30),2));

        $("#calc-user-min-cpm-yearly").text(number_format((earningsLow*30*12),2));
        $("#calc-user-max-cpm-yearly").text(number_format((earningsHigh*30*12),2));

}

function trackUser() {
    if($("#calc-user").val() == "Would you like to Input a Youtube Username? (Optional)")
        return NULL; // present error here
    else {
        var query = $("#calc-user").val();

        $.post( "/js/class/youtube-money-calculator", {query: query}, function( data ) {
            if(data >= 0) {
                $("#calc-daily-views").val(number_format(Math.floor(data)));
                $('#calc-views-hidden').val(Math.floor(data));

                var tmpView = Math.floor(data);

                $('#view-range-slider').val(tmpView);
                calcValue();
            }
        });
    }
}

function rand(min,max) { return Math.floor(Math.random()*(max-min+1)+min); }
function isNumeric(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){

            array.splice(i,1);
            break;
            }
    }
}

function escapeHtml(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    color = '#' + parts.join('');
}

function emailval(email) { var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; return re.test(email); }

function checkURL(url) {
	var myVariable = url;
	if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(myVariable)) {
		return true;
	} else {
		return false;
	}
}


jQuery.fn.shake = function(intShakes, intDistance, intDuration) {
    this.each(function() {
        $(this).css("position","relative");
        for (var x=1; x<=intShakes; x++) {
        $(this).animate({left:(intDistance*-1)}, (((intDuration/intShakes)/4)))
    .animate({left:intDistance}, ((intDuration/intShakes)/2))
    .animate({left:0}, (((intDuration/intShakes)/4)));
    }
  });
return this;
};

jQuery.fn.scrollTo = function(elem) { 
    $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top); 
    return this; 
};

jQuery.fn.putCursorAtEnd = function() {

  return this.each(function() {
    
    // Cache references
    var $el = $(this),
        el = this;

    // Only focus if input isn't already
    if (!$el.is(":focus")) {
     $el.focus();
    }

    // If this function exists... (IE 9+)
    if (el.setSelectionRange) {

      // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
      var len = $el.val().length * 2;
      
      // Timeout seems to be required for Blink
      setTimeout(function() {
        el.setSelectionRange(len, len);
      }, 1);
    
    } else {
      
      // As a fallback, replace the contents with itself
      // Doesn't work in Chrome, but Chrome supports setSelectionRange
      $el.val($el.val());
      
    }

    // Scroll to the bottom, in case we're in a tall textarea
    // (Necessary for Firefox and Chrome)
    this.scrollTop = 999999;

  });

};


function storageCheck(type) {
	try {
		var storage = window[type];
		var tester = '__storage_test__';
		storage.setItem(tester, tester);
		storage.removeItem(tester);
		return true;
	}
	catch(e) {
		localStorage.clear();
		try {
			storage = window[type];
			tester = '__storage_test__';
			storage.setItem(tester, tester);
			storage.removeItem(tester);
			return true;
		}
		catch(e) {
			return false;
		}
	}
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function jq( myid ) { return "#" + myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" ); }

function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

function numberWithSpaces(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

function money(n,countrycode){return"<span style = 'color:#6cb700';>"+ countrycode+ n+"</span>";}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(typeof haystack[i] == 'object') {
            if(arrayCompare(haystack[i], needle)) return true;
        } else {
            if(haystack[i] == needle) return true;
        }
    }
    return false;
}

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

// REPORT CARD GENERATION
function btn_reports_get_report_card(stage = 0, obj = null) {
    if(stage == 0)
        var that = $("#btn-reports-reportcard-get-report-card");
    else if(stage == 1) {
        var that = $("#btn-reports-reportcard-download-report-card");
    } else if(stage == 2) {
        var that = obj;
    }
    var _data_userid = $(that).attr("data-userid");
    var _data_action = $(that).attr("data-action");
    var _data_platform = $(that).attr("data-platform");
    var _data_query = $(that).attr("data-query");
    var _security_token = $(that).attr("data-security");

    $("#icon-reports-reportcard-get-report-card").attr('class', 'fa fa-spinner fa-pulse fa-fw');

    $.post( "/js/class/reports/cards/get-download", { action:_data_action, platform:_data_platform, query:_data_query, security_token:_security_token }, function( data ) {
        var response = JSON.parse(data);

        var status_type = response["status"];
        var status_message = response["message"];
        
        if(status_type == "SUCCESS") {
            // GENERATE URL
            var outbound_url = "/tools/outbound/"+_data_platform+"/"+_data_userid+"/"+_security_token+"/"+_data_query;

            $("#icon-reports-reportcard-get-report-card").attr('class', 'fa fa-download');
            $("#text-reports-reportcard-get-report-card").text("Download Report Card");
            $("#btn-reports-reportcard-get-report-card").attr("href", outbound_url);
            $("#btn-reports-reportcard-get-report-card").attr("class", "core-button core-margin core-small-wide ui-evergreen");
            
            // UNBIND LISTENER
            $('#btn-reports-reportcard-get-report-card').unbind('click');
            
            // SUCCESS MESSAGE
            //toastr.clear();
            //toastr["success"]("Social Blade has successfully generated this report for you.");

        } else if(status_type == "ERROR") {
            $("#icon-reports-reportcard-get-report-card").attr('class', 'fa fa-address-card-o');
            toastr.clear();
            switch(status_message) {
                case "platform-invalid":
                    toastr["error"]("The platform currently selected appears to be invalid.");
                    break;
                case "credits-insufficient":
                    toastr["error"]("You have run out of report card credits for this month.");
                    break;
                case "userid-invalid":
                    toastr["error"]("It appears that you are attempting to get a report that does not belong to you.");
                    break;     
                case "action-invalid":
                    toastr["error"]("It appears that the action you have chosen is invalid for the context of this report.");
                    break;   
                case "platform-invalid":
                    toastr["error"]("It appears that the platform for this report is returning as an invalid platform.");
                    break; 
                case "security token":
                    toastr["error"]("It appears that your security token is no longer valid.");
                    break;                                                                                                              
                default:
                    toastr["error"]("An unknown/unidentified error has occured. Please report this and any information you can.");                            
                    break;
            }
        } else {
            $("#icon-reports-reportcard-get-report-card").attr('class', 'fa fa-address-card-o');
            toastr.clear();
            toastr["error"]("Something went wrong. We don't quite know what. Please report this and how you got to it. Case Number: #10021");
        }
    });            
}

function time_remaining(n) {
    var num = n;
    var hours = (num / 60 / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    var seconds = Math.ceil((minutes - rminutes) * 60);
    
    var msg = "";
    if(rhours > 0) {
        msg += rhours+"h";
    }

    if(rminutes > 0) {
        msg += rminutes+"m";
    }

    if(seconds > 0) {
        msg += seconds+"s";
    }
    
    return msg;
    }
