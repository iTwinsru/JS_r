(function(root) 
{
	LOG=console.log	
	var Icon=function(opt)
	{
		var opt=opt||{};
		this.hwnd=[];
		this.hwnds={};
		this.select='';
		this.mselect=false;
		this.lastright=-1;
		this.uniqueID=1;
		this.im=false;
		this.zindex_=1;
		this.rect={w:64,h:64,l:0,t:0};
		this.move=('move' in opt)?true:false;
		this.parent=('parent' in opt)?opt.parent:document.body;
		this.parentrect={};
		if('rect' in opt)for(var i in opt.rect){this.rect[i]=opt.rect[i]};
		this.action=('action' in opt)?opt.action:null
		this.contextmenu=opt.contextmenu;
		this.greed={l:this.rect.l,t:this.rect.t}
		this.x=0;
		this.y=0;
		this.m_xy=0;
		this.oX=0;
		this.oY=0;
		this.eX=0;
		this.eY=0;
		this.tX=0;
		this.tY=0;
		
		let this_=this;
		$(this.parent).el('mouseup',function(e)
		{	
			if(e.target.id.indexOf("ico")==-1)this_.unselect();
		})
		
	}
	Icon.prototype.clear=function()
	{
		this.hwnd=[];
		this.select='';
		this.mselect=false;
		this.lastright=-1;
		this.uniqueID=1;
		this.im=false;
		this.zindex_=1;
		this.greed.l=this.rect.l;
		this.greed.t=this.rect.t;
		this.m_xy=0;
		this.oX=0;
		this.oY=0;
		this.eX=0;
		this.eY=0;
		this.tX=0;
		this.tY=0;
		this.name='';
	}
	Icon.prototype.resize=function(res)
	{
		let l,t,w
		function rsz(th,l_,t_,p)
		{
			l=l_
			t=t_
			for(var o=0;o<th.hwnd.length;o++)
			{
				$(th.parent,th.hwnd[o]).style({left:l,top:t})
				if(l+th.rect.w+35+15>w)
				{
					l=th.rect.l
					t+=th.rect.h+26+15
				}
				else
					l+=th.rect.w+35+15
			}			
		}
		let prw=parseInt($(this.parent).rect().width)
		let prl=parseInt($(this.parent).rect().left)
		if(prw>(this.rect.w+26+15)&& this.lastright<=this.hwnd.length)
		{
			
			if(this.lastright==-1)this.lastright=this.hwnd.length-1
			let lst=parseInt($(this.parent,this.hwnd[this.lastright]).rect().right)-prl

			if((prw-lst)<0)
			{
				w=parseInt($(this.parent,this.hwnd[this.lastright-1]).rect().right)-parseInt($(this.parent).rect().left)
				rsz(this,this.rect.l,this.rect.t,this.lastright--)
			}
			if((prw-lst)>(this.rect.w+35+15))
			{	
				w=parseInt($(this.parent,this.hwnd[this.lastright]).rect().left)-parseInt($(this.parent).rect().left)+this.rect.w+35+15
				if(typeof this.hwnd[this.lastright+1]!=='undefined')
					rsz(this,this.rect.l,this.rect.t,++this.lastright)
			}
		}
		this.parentrect=res;
	}
	Icon.prototype.unselect=function()
	{
		if(this.mselect)
		{
			for(let i=0;i<this.select.length;i++)
				$(this.select[i].obj).style({'box-shadow':'',background:''})
		}
		else
		{
			if(this.select!="")
			{
				$(this.hwnds[this.select].obj).style({'box-shadow':'',background:'','z-index':1});
				$(this.parent,this.select,'>p').style({webkitLineClamp:2});
			}
		}
		this.mselect=false;
		this.select='';
	}
	Icon.prototype.sel=function(opt)
	{
		this.unselect();
		if(typeof opt==='string')
			$(this.hwnds[opt].obj).style({'box-shadow':'0px 0px 5px 2px rgba(173,255,47,1)',background:'#287233'});
		else
		{
			this.select=opt;
			this.mselect=true;
			for(let i=0;i<opt.length;i++)
				$(opt[i].obj).style({'box-shadow':'0px 0px 5px 2px rgba(173,255,47,1)',background:'#287233'});
		}
	}
	Icon.prototype.caption=function()
	{
		let out=[];
		if(this.mselect)
		{
			for(let i=0;i<this.select.length;i++)	
			{
				out.push($(this.select[i].obj,'>p').txt());
			}
			return out;
		}
		else
			return $(this.parent,this.select,'>p').txt();
	}
	Icon.prototype.size=function(id,w,h)
	{
		let obj=this.hwnds[this.hwnd[id]].obj;
		obj.style.width=w+26;
		obj=$(obj,`${this.hwnd[id]}_body`,true)
		$(obj).style({width:w,height:h});
		obj=$(obj,`${this.hwnd[id]}_img`,true)
		$(obj).style({width:w,height:h});
		this.rect.w=w;
		this.rect.h=h;
		this.resize(this.parentrect);
	}
	Icon.prototype.sizeall=function(w,h)
	{
		for(let i=0;i<this.hwnd.length;i++)
			this.size(i,w,h);
	}
	Icon.prototype.create=function(opt)
	{
		var this_=this;
		if(!('name' in opt))opt.name='ico'+(this_.uniqueID++)
		else opt.name='ico'+opt.name
		if(!('img' in opt))opt.img='img/desktop/noimg.png'
		if(!('caption' in opt))opt.caption=''
		if('rect' in opt)for(var i in opt.rect)this_.rect[i]=opt.rect[i]
		if(!('type' in opt))opt.type='ico';
		if(this_.hwnd.length!=0)
		{
			let pr=$(this_.parent).rect()
			if((this_.greed.l+this_.rect.w*2+35+15)>pr.width)
			{
				this_.greed.l=this_.rect.l
				this_.greed.t+=this_.rect.h+26+15
				if(this_.lastright==-1)this_.lastright=this_.hwnd.length-1
			}
			else
			{
				this_.greed.l+=this_.rect.w+35+15
			}
		}
		let wm=this_.rect.w+26,mm='margin: 0 auto',clm='icon';
		if(opt.type=='toolbar')
		{
			wm=this_.rect.w;
			mm='margin-top:3';
			clm='toolbar';
		}
		this_.hwnds[opt.name]={'hwnd':opt.name,'caption':opt.caption,'img':opt.img,'action':opt.action,uniq:this_.uniqueID,parent:this_.parent,type:opt.type}
		if('id' in opt)this_.hwnds[opt.name].id=parseInt(opt.id)		
		let out='<div id="'+opt.name+'"class="notselect '+clm+'" style="z-index: '+this_.zindex_+';width: '+(wm)+'px;left: '+this_.greed.l+'px; top: '+this_.greed.t+'px;">\
	    		 <div id="'+opt.name+'_body" style="user-select: none;overflow:hidden; display:block; width: '+this_.rect.w+'px; height: '+this_.rect.h+'px;'+mm+'; border-radius: 0px 0px 8px 8px;">\
		         <img id="'+opt.name+'_img" src="'+opt.img+'" style="pointer-events: none;width:'+this_.rect .w+'px;height:'+this_.rect.h+'px" /></div>\
				 <p align="center" style="pointer-events: none;margin:0 0 3 0">'+opt.caption+'</p></div>'
		//$.create('div',out,this_.parent)
		this_.hwnds[opt.name].obj=$.create('div',out,this_.parent);
			//document.onkeypress=function(key){if(key.keyCode=13 && Icon.select!='')($(true,this_.parent,Icon.select).ondblclick)()};
		let prn=$(this_.parent,opt.name);

		prn.on('mousedown',function(e)
		{
			let target=e.target.id.split('_')[0];
			if(e.button==0)
			{
				this_.unselect();
				this_.m_xy = document.elementFromPoint(event.clientX, event.clientY);
				this_.oX=parseInt($(true,this_.parent,opt.name).style.left);
				this_.oY=parseInt($(true,this_.parent,opt.name).style.top);
				this_.eX=WIN.MXY().x;
				this_.eY=WIN.MXY().y;
				this_.im=true;
				this_.select=target;
			}
			else
			{
				if(this_.mselect)
				{
					let find=()=>
					{
						for(let i in this_.select)
							if(this_.select[i].id==target)
								return false;
						return true;
					}
					
					if(find())
					{
						this_.unselect();
						this_.select=target;
					}
				}
				else
				{
					this_.unselect();
					this_.select=target;
				}
			}
			$(this_.parent,target,'>p').style({webkitLineClamp:10});
			if(opt.type!='toolbar')$(this_.parent,target).style({'z-index':2,'box-shadow':"0px 0px 5px 2px rgba(173,255,47,1)",background:"#287233"})
		})
		prn.on('mouseup',function(e)
		{
			if($(true,this_.parent,opt.name)!=null) $(true,this_.parent,opt.name).style.opacity = 1;
			this_.im=false;
		})
		if(this_.move)$(this_.parent).on('mousemove',function(e)
		{
			if(this_.m_xy.id==opt.name+'_img' || this_.m_xy.id==opt.name+'_body' && this_.im==true)
				$(this_.parent,opt.name).style({opacity:0.7,top:(WIN.MXY().y+this_.oY-this_.eY+'px'),left:(WIN.MXY().x+this_.oX-this_.eX+'px')})
		})
		
		if('action' in opt)
		{
			this_.action=opt.action;
			if('isMobile' in CD.useragent || opt.type=='toolbar')
				$(this_.parent,opt.name).on('click',()=>(opt.action)(this_.hwnds[this_.select]))
			else
				$(this_.parent,opt.name).on('dblclick',()=>(opt.action)(this_.hwnds[this_.select]))
//				$(this_.parent,opt.name).on('dblclick',function(){try{(opt.action)()}catch{WIN.DLG({type:'err',caption:Icon.caption(this.id),msg:"Приложение не открывается!"})}})
		}
		else
		{
			if(this.action!=null)
			{
				if('isMobile' in CD.useragent)
					$(this_.parent,opt.name).on('click',()=>(this_.action)(this_.hwnds[this_.select]))
				else
					$(this_.parent,opt.name).on('dblclick',()=>(this_.action)(this_.hwnds[this_.select]))
			}
		}
		if('contextmenu' in opt)
		{
			$(this_.parent,opt.name).on('contextmenu',(e)=>
			{
				let sel=e.target.id;
				if(sel.indexOf('_')>=0)sel=sel.split('_')[0];
				e.preventDefault();
				e.stopPropagation();
				if('isMobile' in CD.useragent)opt.contextmenu(this_.hwnds[sel]);
				else
				opt.contextmenu(this_.mselect?this_.select:this_.hwnds[this_.select]);
			})
		}
		this.hwnd.push(opt.name)
	}
   if ( typeof root === 'object' ) root.Icon = Icon;
})(this)
