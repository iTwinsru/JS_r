(function(root) 
{ 
	'use strict';
    let WIN=
    {   
		HWND:[],
		zindex_:2,
		uniqueID_:0,
		wma:false,
		wra:false,
		winselect:'',
		headsize:20,
		bordesize:3,
		//-------------------------------------
		MXY:function(e)
		{
			var posx = 0;
			var posy = 0;
			if (!e) var e = window.event;
			if (e.pageX || e.pageY)
			{
				posx = e.pageX;
				posy = e.pageY;
			}
			else if (e.clientX || e.clientY)
			{
				posx = e.clientX + document.body.scrollLeft+document.documentElement.scrollLeft;
				posy = e.clientY + document.body.scrollTop+document.documentElement.scrollTop;
			}
			return {x: posx, y: posy}
		},
		//-------------------------------------
		isJSON:function(data) 
		{
			try 
			{
				JSON.stringify(data);
				return true;
			}
			catch (ex) { return false; }
		},
		getHWND:function(wn)
	    {
			for(var i=0;WIN.HWND.length;i++)
			{
				//alert(WIN.HWND[i]);
				if(WIN.HWND[i] != null)
					if(WIN.HWND[i].indexOf(wn)>=0) return WIN.HWND[i];
			}
			return false;
		},
		id:function(elm,num)
		{		
			num=num||0;
			var out=$(true,elm)
			for(var i=0;i<60;i++)
			{
				if(out.className=='win') {return num==0?out.id:out.id.match(/\d+/)[0];break}
				out=out.parentElement
			}
			return null;
		},
		getHWNDUnderMous:function(){return document.elementFromPoint(event.clientX, event.clientY).id;},
		Head:function(wn){return $(true,wn+'_head');},
		Body:function(wn){return $(true,wn+'_body');},
		FButton:function(wn,butt,evn,funct)
		{
			$(wn+'_'+butt).on(evn,funct);
		},
		Caption:function(wn,cap)
		{
			if(cap==null)return $(true,wn+'_caption').innerHTML;
			else $(true,wn+'_caption').innerHTML=cap;
		},
		isHead:function(id,obj)
		{
			if($(obj,true).id==`${String(id)}_caption` || $(obj,true).id==`${String(id)}_head`) return true; else return false;
		},
		RM:function(id,e,or)
		{
			let x = event.clientX, y = event.clientY, m_xy = document.elementFromPoint(x, y);
			let ew=$(m_xy).rect().right-x,eh=$(m_xy).rect().bottom-y;
			let oX=parseInt($(true,id).style.left),oY=parseInt($(true,id).style.top); 
			function rm(e)
			{
				let obj=$(true,id);
				if(String(m_xy.id)==$(true,id).id && WIN.wra==true)
				{
					if(ew<=6) obj.style.width=event.clientX-$(id).rect().left;
					if(eh<=6) obj.style.height=event.clientY-$(id).rect().top-WIN.headsize;
					if(or!=null)(or)({w:parseInt(obj.style.width),h:parseInt(obj.style.height)});
				}
				else obj.style.cursor='default';

				if(WIN.isHead(id,m_xy) && WIN.wma==true)
					$(obj).style({top:(WIN.MXY().y+oY-y+'px'),left:(WIN.MXY().x+oX-x+'px')});
			}
			function cl(e)
			{	
				WIN.wra=false;
				WIN.wma=false;
				if($(true,id)!=null)$(id).style({cursor:'default',opacity:1});
				$(document).remel('mousemove',rm);
			}
			$(document).el('mousemove',rm);
			$(document).el('mouseup',cl);
		},
	  	Move:function(id)
		{
			var x,y,m_xy,ew,eh;
			function mm(e)
			{
				x = event.clientX; y = event.clientY; m_xy = document.elementFromPoint(x, y);
				ew=m_xy.getBoundingClientRect().right-x; eh=m_xy.getBoundingClientRect().bottom-y;
				if(String(m_xy.id)==id)
				{
					if(ew<=8 && eh<=8)
					{  
						$(true,id).style.cursor='se-resize';
					}
					else
					{
						if(ew<=2) $(true,id).style.cursor='e-resize';
						if(eh<=2) $(true,id).style.cursor='s-resize';
					}
					
				}
				else $(true,id).style.cursor='default';
					
			}
			$(true,id).onmousemove=function(e){if(document.onmousemove!=null)(document.onmousemove)(e);mm(e)};
		},
		SelectTab:function(id,tab,idx)
		{
			$(id,tab).attrib('s',idx)
			for (var i = 1; i <= parseInt($(id,tab).attrib('c')); ++i)
			{
				var _tab = $(true,id,"tab"+i);
				var _tabTitle = $(true,id,"tab-title"+i);
				if (idx != i)
				{
					_tab.setAttribute("class", "tab");
					_tabTitle.setAttribute("class", "tab-title");
				}
				else
				{
					_tab.setAttribute("class", "tab selected");
					_tabTitle.setAttribute("class", "tab-title selectedli");
				}
			}
		},
		TabSel:function(wp,tabs,sel)
		{			
			let tabsel=parseInt($(wp,tabs,"@s",true))-1
			$(wp,tabs,'tabs',"<div",true)[tabsel].setAttribute("class", "tab")
			$(wp,tabs,'butts',"<li",true)[tabsel].setAttribute("class", "butt")
			$(wp,tabs,"tabs","<div",true)[sel-1].setAttribute("class", "selt")
			$(wp,tabs,'butts',"<li",true)[sel-1].setAttribute("class", "butt selb")
			$(wp,tabs).attrib('s',sel)
		},
		Animate:function(wn,opt,callback)
		{
			if(callback==null)callback=function(){return 0;};
			if($(true,wn)==null) wn=wn+String(WIN.uniqueID_);
			var start = new Date;
			var progress="";
			 
			var Opacity=function() // [1000,'opacity','del']
			{
				if($(true,wn)!=null)
				{
					progress /= opt[0];
					if (progress > 1) progress = 1;
					if(opt[2]=="hide" || opt[2]=="del")$(true,wn).style.opacity = 1-progress;
					if(opt[2]=="show")$(true,wn).style.opacity = progress;
					if (progress == 1)
					{
						if(opt[2]=="del")WIN.Delete(wn,callback);
						clearInterval(timer);
					}
				}
				else clearInterval(timer);
			}
			var Height=function() // [20,'height','+',сейчас,станет]
			{
				var h_=parseInt($(true,wn).style.height);
				if(h_<=opt[4] && h_+opt[0]<=opt[4])
					WIN.State({id:wn,h:{a:opt[2],v:opt[0]}});
				else
				{
				   WIN.State({id:wn,h:{a:opt[2],v:1}});
				   if(h_>=opt[4])clearInterval(timer);
				}            
			}
			var Width=function() // [20,'width','+',сейчас,станет]
			{
				var w_=parseInt($(true,wn).style.height);
				if(w_<=opt[4] && w_+opt[0]<=opt[4])
				   WIN.State({id:wn,w:{a:opt[2],v:opt[0]}});
				else
				{
				   WIN.State({id:wn,w:{a:opt[2],v:1}});
				   if(w_>=opt[4])clearInterval(timer);
				}
			}
			 
			var timer = setInterval(function()
			{
				progress = (new Date - start) ;
				if(opt[1]=="opacity") Opacity();
				if(opt[1]=="h") Height();            
				if(opt[1]=="w") Width();
			}, 20);
		},
      Hide:function(wn) {$(true,wn).style.display='none';},
      Show:function(wn) {$(true,wn).style.display='block';},
      Delete:function(wn,callback)
      {
         if($(true,wn)!=null)
         {
            var getposarrey=-1,arr=[];
			//if(typeof Icon!=='undefined')Icon.unselect()
            for(var h=0;h<WIN.HWND.length;h++) if(WIN.HWND[h]==wn) {getposarrey=h;break;}
            for(var h=0;h<WIN.HWND.length;h++) if(h!=getposarrey)arr.push(WIN.HWND[h]);
            WIN.HWND=arr;
            delete window.arr;
			WIN.winselect='';
            $(wn).remove();
            if($(true,"s_"+wn)!=null) $("s_"+wn).remove();
			if(typeof callback === 'function')callback(wn);
         }
      },
      State:function(opt)
      {
         //alert(opt.id);
         if(WIN.isJSON(opt))
         {
            if('w' in opt) 
            {
               if(typeof opt.w.a!='undefined')
               {
                  if(opt.w.a=="+")$(true,opt.id).style.width=parseInt($(true,opt.id).style.width)+opt.w.v;
                  if(opt.w.a=="-")$(true,opt.id).style.width=parseInt($(true,opt.id).style.width)-opt.w.v;
               }
               else
                  $(true,opt.id).style.width=opt.w;
            }
               
            if('h' in opt)
            {
               if(typeof opt.h.a!='undefined')
               {
                  if(opt.h.a=="+")$(true,opt.id).style.height=parseInt($(true,opt.id).style.height)+opt.h.v;
                  if(opt.h.a=="-")$(true,opt.id).style.height=parseInt($(true,opt.id).style.height)-opt.h.v;
               }
                  else
                     $(true,opt.id).style.height=opt.h;
            }
            if('l' in opt) 
            {
               if(typeof opt.l.a!='undefined')
               {
                  if(opt.l.a=="+")$(true,opt.id).style.left=parseInt($(true,opt.id).style.left)+opt.l.v;
                  if(opt.l.a=="-")$(true,opt.id).style.left=parseInt($(true,opt.id).style.left)-opt.l.v;
               }         
               else
                  $(true,opt.id).style.left=opt.l=='c'?(parseInt(document.documentElement.clientWidth)/2 - parseInt(opt.w)/2):opt.l;
            }
            if('t' in opt)
            {
               if(typeof opt.t.a!='undefined')
               {
                  if(opt.t.a=="+")$(true,opt.id).style.top=parseInt($(true,opt.id).style.top)+opt.t.v;
                  if(opt.t.a=="-")$(true,opt.id).style.top=parseInt($(true,opt.id).style.top)-opt.t.v;
               } 
               else         
                  $(true,opt.id).style.top=opt.t=='c'?(parseInt(document.documentElement.clientHeight)/2 - parseInt(opt.h)/2):opt.t;
            }
            if('c' in opt) $(opt.id+"_caption").txt(opt.c);
         }
      },
      SetFocus:function(wn,fl,cb) 
      {
		 function flash(c,i)
		 {
			if(c>0)
			{
				setTimeout(() =>
				{
					$(true,wn).style.boxShadow="0px 0px 5px 2px rgba(80,80,80,1)"
					setTimeout(() => {$(true,wn).style.boxShadow="0px 0px 5px 2px rgba(173,255,47,1)";flash(parseInt(c)-1,i)}, i);
				}, i);
			}
		 }
         if($(true,wn)!=null)
         {
            if(WIN.winselect!='')
            {
               if($(true,WIN.winselect)!=null){if($(WIN.winselect).attrib('noborder')==null) $(true,WIN.winselect).style.boxShadow="0px 0px 5px 2px rgba(80,80,80,1)";}
               if($(true,"s_"+WIN.winselect)!=null)$(true,"s_"+WIN.winselect).style.background="black";
            }
			if(wn!='statuspanel')
			{
				if(fl)
					flash(3,50);
				else
					$(true,wn).style.boxShadow="0px 0px 5px 2px rgba(173,255,47,1)";
			}
            if(wn.search("login")>=0)
            {
               $(true,wn).style.zIndex=9999;
            }
            else
            {
               WIN.zindex_++;
			   if(wn.indexOf('dlg')>=0)
				  $(true,wn).style.zIndex=(6000+WIN.zindex_)
			   else
			      $(true,wn).style.zIndex=WIN.zindex_
            }
            $(true,wn).style.display='block';
			if($(true,'s_'+wn)!=null) $(true,'s_'+wn).style.background='green';
			if(typeof cb!=='undefined')cb(wn);
			WIN.winselect=wn;
         }
      },
      AddElement:function(wn,out)
      {
         $(wn+"_body").append(out);
      },
      // --- Контекстное меню ---------------------------------------------------------------------
	  	ContextMenu:function(opt)
		{
			WIN.setContextMenu(opt);
			WIN.showContextMenu({wn:opt.wn,name:opt.name});
		},
		setContextMenu:function(opt)
		{
			if($(true,opt.wn,'contextmenu')==null)$.create('div',{id:'contextmenu'},opt.wn);
			if($(true,opt.wn,'contextmenu',opt.name)!=null)$(opt.wn,'contextmenu',opt.name).remove();

			let mitem='<ul class="cm">';
			let menu=$.create('div');
			menu.id=opt.name;
			menu.style='display:none;position:absolute;border:1px solid #0F0;background-color:black;border-radius:5px;z-index:10';
			for(let i=0;i<opt.m.length;i++) mitem+='<li id="cm'+i+'">'+opt.m[i]+'</li>';
			mitem+='</ul>';
			menu.innerHTML=mitem;
			$(opt.wn,'contextmenu').append(menu);
			$(opt.wn,'contextmenu').on('contextmenu',e=>{e.preventDefault();e.stopPropagation();}) 

			if('a' in opt)
			{
				var cm_=$(true,opt.wn,opt.name,'<li');
				for(let i=0;i<opt.a.length;i++) cm_[i].onclick=function(){$(true,opt.wn,opt.name).style.display='none';(opt.a[i])({obj:this,wn:WIN.id(this)})};
			}
			if('f' in opt)
			{
				var cm_=$(true,opt.wn,opt.name,'<li');
				for(let i=0;i<cm_.length;i++) cm_[i].onclick=function(){$(true,opt.wn,opt.name).style.display='none';(opt.f)({obj:this,wn:WIN.id(this)})};
			}
      },
      showContextMenu:function(opt)
      {  
         let cm_=$(true,opt.wn,opt.name)
         if(cm_!=null)
         {
            var xy=WIN.MXY();
            xy.x-=parseInt($(true,opt.wn).style.left);
            xy.y-=parseInt($(true,opt.wn).style.top);
			$(cm_).style({left:xy.x,top:xy.y,display:'block'});
			let pw=$(opt.wn).rect().width,cml=$(cm_).rect().right-$(opt.wn).rect().left
			if(cml>pw)cm_.style.left=xy.x-$(cm_).rect().width
			let ph=$(opt.wn).rect().height, cmt=$(cm_).rect().bottom-$(opt.wn).rect().top
			if(cmt>ph)cm_.style.top=ph-$(cm_).rect().height-5
         }
      },
		hideContextMenu:function(wn)
		{
			if($(true,wn,'contextmenu')!=null)
            {
                let cm=$(wn,'contextmenu').tags('div');			
				for(let i=0;i<cm.length;i++) if(cm[i].style.display!='none')cm[i].style.display='none';
            }
		},
		border:function(wn,trg)
		{
			if(!trg)
			{
				$(wn).attrib('noborder','')
				$(wn).style({padding:'0px 0px 20px 0px',boxShadow:'',background:''})
				$(wn,wn+'_head').style({'border-radius':10,background:'green'});
				$(wn,wn+'_body',true).style.background=''
			}
			else
			{
				$(wn).remattrib('noborder')
				$(wn).style({padding:'0px 3px 23px 3px',background:'green'})
				$(wn,wn+'_head',true).style.borderRadius=''
				$(wn,PUB.wn+'_head',true).style.background=''
				WIN.SetFocus(wn)
			}
		},
//-------------------------------------------------------------------------------------------
		MSG:function(text)
		{
			let wn=WIN.Create({name:'msg',caption:'Уведомление',recreate:true,winstate:[350,350,'c','c',true,true],functionbutton:[true,false,false,false,true,false],actionbutton:{close:['animate',[500,'opacity','del']]}});
			let out = '<textarea class="mainscroll" style="border:0; background-color:0; color:#0f0; height:100%; width:100%; text-align: left;resize:none">'+text+'</textarea>';
			WIN.AddElement(wn,out);
			//WIN.State({id:wn,h:(50+$(wn,wn+'_body').tag('textarea').getBoundingClientRect().height/2)});
			return wn
		},
	  
		DLG:function(opt)
		{
			let img={'info':'img/desktop/info.png','err':'img/desktop/exit.png','alert':'img/desktop/alert.png','okno':'img/desktop/req.png','input':'img/desktop/info.png'}
			let left='c',top='c', ok='ОК',no='Нет';
			if(!('type' in opt) || typeof img[opt.type]==='undefined')opt.type='info';
			if(!('msg' in opt))opt.msg='';
			if(!('caption' in opt))opt.caption='Уведомление';
			if(!('val' in opt))opt.val='';
			if(WIN.winselect.indexOf('dlg')>-1)
			{
				left=($(WIN.winselect).rect().left+20)
				top=($(WIN.winselect).rect().top+25)
			}
			
			let out='<div><img src="'+img[opt.type]+'" style="position: absolute;left:10;top:10;width:56px;height:56px" />\
				   <p style="position: absolute;left:100;top:10;width:220px;word-wrap: break-word;">'+opt.msg+'</p>'
				   
			if(opt.type=='info' || opt.type=='err' || opt.type=='alert')
				out+='<input type="submit" value="'+ok+'" style="position: absolute;bottom:10;right:10;width:100;">'
			if(opt.type=='okno' || opt.type=='input')
			{
				if(opt.type=='input')
				{
					ok='ОК',no='Отмена'
					out+='<input type="text" class="intext" value="'+opt.val+'" style="position: absolute;bottom:10;left:100;top:60;height:20;width:220;">'
				}
				out+='<input type="submit" value="'+ok+'" style="position: absolute;bottom:10;right:120;width:100;">\
					  <input type="submit" value="'+no+'" style="position: absolute;bottom:10;right:10;width:100;">'
			}
			out+='</div>'
			let wn=WIN.Create({name:'dlg',caption:opt.caption,recreate:true,winstate:[350,100,left,top,true,false],functionbutton:[true,false,false,false,true,false],actionbutton:{close:['animate',[300,'opacity','del']]},content:out});
			if(opt.type=='okno' || opt.type=='input')
			{	
				let inp=$(wn,'<input',true),i=0
				if(opt.type=='input') i=1;
				inp[0+i].onclick=function(){if(opt.res!=null){(opt.res)({key:'ok',val:inp[0].value,par:opt.par})};WIN.Animate(wn,[300,'opacity','del'])}
				inp[1+i].onclick=function(){if(opt.res!=null){(opt.res)({key:'no',val:inp[0].value,par:opt.par})};WIN.Animate(wn,[300,'opacity','del'])}
			}
			else
				$(wn).tag('input').onclick=function()
				{
					if('res' in opt) (opt.res)({par:opt.par})
					WIN.Animate(wn,[300,'opacity','del'])
				}
			if($(wn,'<input',true).length>=3)
				WIN.State({id:wn,h:(125+$($(wn,wn+'_body').tag('p')).rect().height/2)});
			else
				WIN.State({id:wn,h:(95+$($(wn,wn+'_body').tag('p')).rect().height/2)});
			//if('isMobile' in CD.useragent) $(wn,true).style.transform="scale(1.7,1.7)"
			//WIN.SetFocus(wn)
		},
	  
		Upload:function(opt)
		{
			CD.files=[]
			for(let i=0;i<opt.files.length;i++) CD.files.push(opt.files[i])
			let left='c',top='c',tsize=0,cfiles='',msg=''
			if('pwn' in opt)
			{
				let pwnrect=$(opt.pwn).rect()
				left=pwnrect.left+(pwnrect.width/2-2-150)
				top=pwnrect.top+(pwnrect.height/2-50)
			}
			if(CD.files.length<=0)
			{
				WIN.DLG({type:'alert',msg:'Ничего не выбранно для загрузки!'})
				return 0;
			}
			cfiles=CD.files.length,msg='Файл: '+CD.files[0].name+',<br> успешно загружен!'
			if(!('path' in opt))opt.path='Upload'
			
			let out='<div><p style="float:left;margin:0 10">Загрузка файла:</p>\
					 <p style="margin:10 0;overflow:hidden;text-overflow:ellipsis;height:60;word-break:break-all;display: -webkit-box;-webkit-line-clamp: 3;">'+CD.files[0].name+'</p>\
				     <progress id="pup" value="0" max="'+CD.files[0].size+'" style="margin:0 0 0 10;border:1px solid green;border-radius:5px;color: green;height: 20px;width:330;"></progress>'
			if(cfiles>1)
			{
				for(let i=0;i<cfiles;i++) tsize+=CD.files[i].size
				out+='<progress id="puptot" value="0" max="'+tsize+'" style="margin:10 10;border:1px solid green;border-radius:5px;color: green;height: 20px;width:330;"></progress>'
			}
			out+='<input type="submit" value="Отменить" style="margin:6 0 10 100;width:150"></div>'
			let wn=WIN.Create({name:'upload',caption:'Загрузка в '+opt.path,head:false,winstate:[350,178,left,top,false,false],content:out,focus:9999});
			//$(wn,true).style.height=''
			let sizetot=0
//			LOG(cfiles)
			function load(i)
			{
				$('upload','pup').attrib('value',0)
				$('upload','pup').attrib('max',CD.files[i].size)
				$('upload','<p',true)[1].innerHTML=CD.files[i].name
				r({f:CD.files[i],d:['t',opt.path]},function(c)
				{
//					LOG(c)
					if('err' in c)
					{
						if(i==cfiles-1) cfiles=1
						if(cfiles==1)
						{
							WIN.DLG({type:'err',caption:'Ошибка загрузки',msg:c.err,res:function()
							{
								WIN.Animate('upload',[300,'opacity','del'])
							}})
						}
					}
					else
					{
						if('ok' in c)
						{
							if(i==cfiles-1) {msg='Файлы успешно загружены!<br>';cfiles=1}
							else 
							{
								sizetot+=CD.files[i].size
								load((parseInt(i)+1))
							}
							if(cfiles==1)
							{
								WIN.Animate('upload',[300,'opacity','del'])
								WIN.DLG({msg:msg})
								if('call' in opt)opt.call(opt.pwn)
								delete CD.files
							}
						}
						else
						{
							$('upload','pup').attrib('value',c.l)
							if($('upload','puptot')!=null)$('upload','puptot').attrib('value',sizetot+c.l)
						}
					}
				})
			}
			load(0)
			//if('isMobile' in CD.useragent) $(wn,true).style.transform="scale(1.7,1.7)"
	  },
//-------------------------------------------------------------------------------------------
    Create:function(opt) 
    { 
        let focus=WIN.zindex_, scroll="overflow:hidden", classscroll="", padding="",margin="",display="none", out='';
        WIN.zindex_++;

        if(WIN.isJSON(opt))
        {
			if(!('name' in opt)) opt.name='window';
            if(!('head' in opt)) {opt.head=true;padding="padding:0 3 23 3;";margin="margin:0;";}
            if(!('body' in opt)) opt.body=true;
            if(!('show' in opt)) {opt.show=true;display="display:block;";}
            if(!('functionbutton' in opt)) opt.functionbutton=[false,false,false,false,true,false];
			if(!('onclose' in opt)) {opt.onclose=function(){return 0};}
            if(!('onresize' in opt)) {opt.onresize=function(){return 0};}
            if(!('onfocus' in opt)) {opt.onfocus=function(){return 0};}

            if('focus' in opt)focus=opt.focus;
			
			if('id' in opt) opt.name+=opt.id;
			else
			{
				if('recreate' in opt || opt.name=='window') 
				{
					WIN.uniqueID_++;
					opt.name+=WIN.uniqueID_;
				}
				else
				{
					if($(true,opt.name)!=null) 
					{
						WIN.SetFocus(opt.name);
						return null;
					}
				}
			}            
            if('scroll' in opt)
            {
               classscroll=' mainscroll';
               if(opt.scroll=='x') scroll="overflow-x:hidden";
               if(opt.scroll=='y') scroll="overflow-y:hidden";
               if(opt.scroll=='a') scroll="overflow:auto";
            }
            
            opt.winstate[2]=opt.winstate[2]=='c'?(parseInt(document.documentElement.clientWidth)/2 - parseInt(opt.winstate[0])/2):opt.winstate[2];
            opt.winstate[3]=opt.winstate[3]=='c'?(parseInt(document.documentElement.clientHeight)/2 - parseInt(opt.winstate[1])/2):opt.winstate[3];

            out=`<div id="${opt.name}" class="win" style="${display} ${margin} ${padding} width:${opt.winstate[0]};height:${opt.winstate[1]};Left:${opt.winstate[2]}; Top:${opt.winstate[3]}; z-index:${focus}">`;
            if(opt.head==true)
            {
               out+=`<div id=${opt.name}_head class="winhead">`;
               if(opt.functionbutton[0])out+=`<div id=${opt.name}_submenu class="submenu"></div>`;
               if(!('caption' in opt))opt.caption='';
               out+=`<p id=${opt.name}_caption class="wincaption">${opt.caption}</p>`            
			   if(opt.functionbutton[4])out+=`<div id=${opt.name}_close class="winfunc close"></div>`;
			   if(opt.functionbutton[2])out+=`<div id=${opt.name}_wmin class="winfunc wmin"></div>`;
               if(opt.functionbutton[3])out+=`<div id=${opt.name}_wmax class="winfunc wmax"></div>`;
               if(opt.functionbutton[1])out+=`<div id=${opt.name}_edit class="winfunc wedit"></div>`;
               if(opt.functionbutton[5])out+=`<div id=${opt.name}_add class="winfunc wadd"></div>`;
               out+='</div>';
            }
            if(opt.body==true)out+=`<div id=${opt.name}_body class="winbody${classscroll}" style="${scroll}"></div>`;
            out+='</div>';
			$.create('div',out,'body');
			let wfl=$(opt.name,'.winfunc',true).length;
			if(wfl>0)$(opt.name,'.wincaption',true)[0].style.maxWidth='calc(100% - '+(17*wfl)+'px)';
			if(!opt.head)$(opt.name,opt.name+'_body').style({height:opt.winstate[1],width:opt.winstate[0],left:0});
			
			if('mobile' in opt && opt.mobile && opt.head)
			{
				//$(opt.name,opt.name+'_head',true).style.height='40px';
				//$(opt.name,opt.name+'_caption',true).style.fontSize=30;
			}
			
            WIN.HWND.push(opt.name);
//            console.log(WIN.HWND);
            if(opt.name=='statuspanel')
            {
               $('statuspanel').attrib('aws','1');
               $(true,'statuspanel').ondblclick=function(e)
               {
                  if(WIN.getHWNDUnderMous().replace('_body','')=='statuspanel')
                  {
                  if($('statuspanel').attrib('aws')==1)
                  {
                     for(var h=0;h<WIN.HWND.length;h++)
                        if($(true,WIN.HWND[h])!=null && WIN.HWND[h]!='statuspanel' && WIN.HWND[h].indexOf('menu')==-1)
                           $(true,WIN.HWND[h]).style.display='none';
                     $('statuspanel').attrib('aws','0');
                  }
                  else
                  {
                     for(var h=0;h<WIN.HWND.length;h++)
                        if($(true,WIN.HWND[h])!=null && WIN.HWND[h]!='statuspanel' && WIN.HWND[h].indexOf('menu')==-1)
                           $(true,WIN.HWND[h]).style.display='block';
                     $('statuspanel').attrib('aws','1');
                  }
                  }
               }
            }
			if($(true,'statuspanel')!=null)
            {
				if(opt.name!='statuspanel')
				{
					var el=$.create('input');
					el.id="s_"+opt.name;
					el.type="submit";
					el.value=opt.caption;
					el.style.margin="3 0 0 3";
					el.style.borderRadius="8px";
					el.onclick=function(e){WIN.SetFocus(this.id.replace('s_',''));}
					el.ondblclick=function(e){if(this.id.indexOf('menu')==-1)WIN.Delete(this.id.replace('s_',''),opt.onclose);}
					$(true,'statuspanel_body').appendChild(el);
					if($(el).rect().top>6)
					{
						let wd=$(el).rect().width;
						let tb=$('statuspanel','<input',true);
						let wd_=(wd/tb.length)-5;
						for(let l of tb)
						{
							l.style.width=$(l).rect().width-wd_;
						}
					}
					delete window.el;
				}
            }
            
            if(typeof opt.show==='object') 
            {
               if(opt.show[0]=='animate')
               {
					$(true,opt.name).style.display='block';
					WIN.State({id:opt.name,h:opt.show[1][3]});
					WIN.Animate(opt.name,opt.show[1]);
               }
            }
            //---- ON ------------------------------
			if(opt.winstate[5])WIN.Move(opt.name);
            $(opt.name).on('mousedown',(e)=>
            {
               WIN.wma=opt.winstate[4];
               WIN.wra=opt.winstate[5];
               WIN.SetFocus(opt.name,0,opt.onfocus);
               WIN.RM(opt.name,event,opt.onresize);
			   if(WIN.isHead(opt.name,e.target)) $(opt.name,true).style.opacity = 0.6;
			   if(e.target.parentNode!=null && e.target.parentNode.parentNode.parentNode.id!='contextmenu')
			      WIN.hideContextMenu(opt.name)
            })
            if(opt.functionbutton[1])
            {
               /*if('id' in opt)
                  $(true,opt.name+'_edit').onclick=function(e){Base.EditDataBase(opt.name);}
               else
               {
                  $(true,opt.name+'_edit').style.display="none";
                  $(true,opt.name+'_edit').onclick="";
               }*/
            }
			if(opt.functionbutton[2])$(true,opt.name+'_wmin').onclick=function(e){WIN.Hide(opt.name);} 
            if(opt.functionbutton[4])
            {
               if('actionbutton' in opt && opt.head) 
               {
                  if('close' in opt.actionbutton)
                  {
                     if(opt.actionbutton.close[0]=="animate")
                        $(true,opt.name+'_close').onclick=function(e){WIN.Animate(opt.name,opt.actionbutton.close[1],opt.onclose);this.onclick="";}
                     else
                        $(true,opt.name+'_close').onclick=function(e){WIN.Delete(opt.name,opt.onclose);}
                  }
                  else
                     $(true,opt.name+'_close').onclick=function(e){WIN.Delete(opt.name,opt.onclose);}
				 
				 if('edit' in opt.actionbutton)$(true,opt.name+'_edit').onclick=opt.actionbutton.edit
               }
               else
			   {
                  if(opt.head)$(true,opt.name+'_close').onclick=function(e){WIN.Delete(opt.name,opt.onclose);}
			   }
            }
			if('content' in opt)WIN.AddElement(opt.name,opt.content);
			WIN.SetFocus(opt.name);
            return opt.name;
         }
         return null;
      } 
   }
   
   // select object
	let OSEL_=function(opt)
	{
		opt=opt||{};
	   	this.parent=('parent' in opt)?$(opt.parent,true):document.body;
	   	this.res=('res' in opt)?opt.res:(res)=>{};
		this.oldmm={};
		this.oldmu={};
		this.oldmd={};
		this.trgdwn=false;
		this.osel=null;
		this.swp=0;
		this.rect={left:0,top:0};
		this.x=0;
		this.x1=0;
		this.x2=0;
		this.y=0;
		this.y1=0;
		this.y2=0;
		this.out=[];
		this.name='osel_'+(this.parent.nodeName=='BODY'?'body':this.parent.id);
	}
	OSEL_.prototype.init=function()
	{
		let self_=this;
		$.create('div',{id:self_.name,style:'display:none;position:absolute;background-color: #00ff00;opacity: .4; width:0; height:0; z-index:5'},self_.parent);

		$(self_.parent).el('mousedown',function(e)
		{
			if(e.target.id==self_.parent.id || e.target.nodeName=='CANVAS')
			{
				if(self_.parent.nodeName!='BODY')self_.rect=self_.parent.getClientRects()[0];
				self_.x1=event.clientX-self_.rect.left;
				self_.y1=event.clientY-self_.rect.top;
				self_.trgdwn=true;
				self_.osel=$(self_.name,true);
				$(self_.osel).style({left:self_.x1,top:self_.y1,display:'block',width:0,height:0});
			}
		});
		$(self_.parent).el('mouseup',function(e)
		{
			if(self_.trgdwn && self_.x1!=event.clientX-self_.rect.left && self_.y1!=event.clientY-self_.rect.top)
			{
				if(self_.x1>self_.x){let swp=self_.x1;self_.x1=self_.x;self_.x=swp;}
				if(self_.y1>self_.y){let swp=self_.y1;self_.y1=self_.y;self_.y=swp;}
				self_.parent.childNodes.forEach(function(item, i)
				{
					try
					{
						let rect=item.getClientRects()[0];
						if(rect.right-self_.rect.left>self_.x1 && rect.left-self_.rect.left<=self_.x && rect.bottom-self_.rect.top>self_.y1 && rect.top-self_.rect.top<=self_.y)
						{
							if(item.id!='mtrx' && item.id!=self_.name && item.id!='statuspanel')
								self_.out.push({id:item.id,obj:item});
						}
					}
					catch(e){}
				});
				if(self_.out.length>0)(self_.res)(self_.out);
				self_.osel.style.display='none';
				self_.osel=null;
				self_.x1=self_.y1=self_.x2=self_.y2=0;
				self_.rect={left:0,top:0};
				self_.swp=0;
				self_.out=[];
			}
			self_.trgdwn=false;
		});
		
		$(self_.parent).el('mousemove',function(e)
		{
			let l=0,t=0;
			if(self_.trgdwn)
			{
				self_.x = event.clientX-self_.rect.left, self_.y = event.clientY-self_.rect.top;
				self_.x2=self_.x-self_.x1;
				self_.y2=self_.y-self_.y1;
				l=self_.x1;
				t=self_.y1;
				if(self_.x2<0)
				{
					self_.x2=self_.x1-self_.x;
					l=self_.x;
				}
				if(self_.y2<0)
				{
					self_.y2=self_.y1-self_.y;
					t=self_.y;
				}
				
				$(self_.osel).style({left:l,top:t,width:self_.x2,height:self_.y2});				
			}
		});
	}
	function OSEL(opt)
	{
		new OSEL_(opt).init();
	}
   if ( typeof root === 'object' ) root.WIN = WIN;root.OSEL=OSEL;
})(this)