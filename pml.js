(function(root) 
{
	let PML=function()
	{
		this.obj='';
	}
	PML.prototype.parse=function(arg)
	{
		let sel=''
		for(let a=0;a<arg.length;a++)
		{
			if(typeof arg[a]!=='boolean')
			{
				if(typeof arg[a] === 'string') 
				{
					if(sel=='')
					{
						let pref=arg[a].substr(0,1);
						if(pref=='#')this.obj=(typeof this.obj === 'object')?this.obj.querySelector(arg[a]):document.querySelector(arg[a]);
						else if(pref=='.')this.obj=(typeof this.obj === 'object')?this.obj.getElementsByClassName(arg[a].substr(1)):document.getElementsByClassName(arg[a].substr(1));
						else if(pref=='<')this.obj=(typeof this.obj === 'object')?this.obj.getElementsByTagName(arg[a].substr(1)):document.getElementsByTagName(arg[a].substr(1));
						else if(pref=='>')this.obj=(typeof this.obj === 'object')?this.obj.getElementsByTagName(arg[a].substr(1))[0]:document.getElementsByTagName(arg[a].substr(1))[0];
						else if(pref=='@')this.obj=this.obj.getAttribute(arg[a].substr(1))
						else if(pref=='*')this.obj=this.obj.querySelectorAll(arg[a].substr(1))
						else this.obj=(typeof this.obj === 'object')?this.obj.querySelector('#'+arg[a]):document.querySelector('#'+arg[a]);
					}
					
				}
				if(typeof arg[a] === 'object') this.obj=arg[a]
				if(typeof arg[a] === 'number')
				{
					if(arg[a]==0) this.obj= document;
					if(arg[a]==1) this.obj= document.body;
				}
			}
		}
	}
	PML.prototype.dom=function(){return this.obj}
	PML.prototype.remove=function()
	{
		if(typeof this.obj[0]==='undefined')
			this.obj.parentNode.removeChild(this.obj);
		else
			this.obj[0].parentNode.removeChild(this.obj[0]);
	}
	PML.prototype.click=function(){this.obj.click();this.remove()}
	PML.prototype.txt=function(){if(arguments.length>0)this.obj.innerText=arguments[0];else return this.obj.innerText}
	PML.prototype.html=function(){if(arguments.length>0)this.obj.innerHTML=arguments[0];else return this.obj.innerHTML}
	PML.prototype.tags=function(tag){return this.obj.getElementsByTagName(tag)}
	PML.prototype.tag=function(tag){return this.obj.getElementsByTagName(tag)[0]}
	PML.prototype.rect=function(){return this.obj.getBoundingClientRect()}
	PML.prototype.rects=function(){return this.obj.getClientRects()[0]}
	PML.prototype.hasclass=function(cls){return new RegExp("(^|\\s)"+cls+"(\\s|$)").test(this.obj.className)}
	PML.prototype.el=function(ev,fn){this.obj.addEventListener(ev,fn);}
	PML.prototype.remel=function(ev,fn){this.obj.removeEventListener(ev,fn);}
	PML.prototype.remattrib=function(){if(arguments.length==1) return this.obj.removeAttribute(arguments[0])}
	PML.prototype.attrib=function()
	{
		if(arguments.length==1) return this.obj.getAttribute(arguments[0])
		if(arguments.length==2) return this.obj.setAttribute(arguments[0],arguments[1])
	}
	PML.prototype.toggleclass=function(cls)
	{
		if(this.hasclass(cls))this.obj.className=this.obj.className.replace(' '+cls,'')
		else this.obj.className+=' '+cls;
	}
	PML.prototype.class=function()
	{
		if(arguments.length==0)
			return this.obj.className;
		else	
			this.obj.className=arguments[0];
	}
	PML.prototype.on=function()
	{
		if(arguments.length==1)
			(this.obj['on'+arguments[0]])()
		else	
			this.obj['on'+arguments[0]]=arguments[1];
	}
	PML.prototype.style=function(opt)
	{
		for(let [k,v] of Object.entries(opt))
			this.obj.style[k]=v;
	}
	PML.prototype.append=function()
	{
		if(arguments.length==1)
		{
			if(typeof arguments[0]!=='object')
			{
				var el=document.createElement('div');
				el.innerHTML=arguments[0];
				if(typeof this.obj.appendChild!=='undefined')
					this.obj.appendChild(el.firstChild);
				else
					this.obj[0].appendChild(el.firstChild);
				this.obj=el.firstChild
				
				return this.obj
			}
			else this.obj.appendChild(arguments[0])
		}
		if(arguments.length==2)
		{
			var el=document.createElement(arguments[0]);
			var v_=arguments[1];
			for(v in v_) el[v]=v_[v];
			if(typeof this.obj.appendChild!=='undefined')
				this.obj.appendChild(el);
			else
				this.obj[0].appendChild(el);
			return el
		}
	}	
	let $=function()
	{
		let arg = Array.prototype.slice.call(arguments, 0);
		let obj =new PML();
		obj.parse(arguments);
		if(obj.obj==null) return null
		if(arg.indexOf(true)>=0)return obj.dom();
		else return obj
	}
	$.create=function()
	{
		let el=document.createElement(arguments[0]),v_;
		if(arguments.length==1)return el
		else
		{
			v_=arguments[1];
			if(typeof arguments[1]==='object')
			{	
				for(v in v_) el[v]=v_[v];
			}
			else
			{
				el.innerHTML=v_;
				el=el.firstChild;
			}
			if(arguments.length<3)
			{
				return el;
			}
			else
			{
				try
				{
					$[arguments[2]](el)
				}
				catch(e)
				{
					$(arguments[2]).append(el)
				}
			}
			return el;
		}
		delete el
	}
	$.head=function()
	{
		if(arguments.length==1) return $(document.getElementsByTagName('head')[0].appendChild(arguments[0]));
		return document.getElementsByTagName('head')[0];
	}
	$.body=function()
	{
		if(arguments.length==1)return $(document.getElementsByTagName('body')[0].appendChild(arguments[0]));
		return document.getElementsByTagName('body')[0];
	}
	$.class=function(cls){return document.querySelectorAll('.'+cls)}

	$.b64e=str=>{return window.btoa(unescape(encodeURIComponent(str)));}
	$.b64d=str=>{return decodeURIComponent(escape(window.atob(str)));}
	$.decodetxt=txt=>
	{
		var out=[]
		for(var f=0;f<txt.length;f++)
		{
			if(txt.charCodeAt(f)<128)out.push(String.fromCharCode(txt.charCodeAt(f)))
			else out.push(String.fromCharCode(txt.charCodeAt(f)+848))
		}
		return out.join('')
	}
	$.bintotxt=txt=>
	{
		var out=[]
		for(var f=0;f<txt.length;f++)
		{
			if(txt.charCodeAt(f)<128)out.push(String.fromCharCode(txt.charCodeAt(f)))
			else 
			{
				if(txt.charCodeAt(f)>=224){out.push(String.fromCharCode(1088+(txt.charCodeAt(f)-224)));}
				else
					out.push(String.fromCharCode(1040+(txt.charCodeAt(f)-128)))
			}
		}
		return out.join('');
	}
	$.xpath=(path)=>
	{
		return document.evaluate (path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	}
	$.clipboardset=(txt)=>
	{
		var data = [new ClipboardItem({ "text/plain": new Blob([txt], { type: "text/plain" }) })];
		navigator.clipboard.write(data);
	}
	if ( typeof root === 'object' ) root.$ = $;
})(this)