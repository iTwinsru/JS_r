(function(root) 
{
	'use strict';
	LOG=console.log;
	var Tree=function(opt)
	{
		var opt=opt||{}
		this.on={};
		this.select='';
		this.zindex_=1;
		this.path='';
		this.rfn=('rootfolder' in opt)?opt.rootfolder:'root';
		this.parent=('parent' in opt)?$(opt.parent,true):document.body;
		this.action=('action' in opt)?opt.action:null;
		if('click' in opt)this.on.click=opt.click;
		if('clicktoggle' in opt)this.on.clicktoggle=opt.clicktoggle;
		this.init();
	}
	Tree.prototype.init=function()
	{
		let self_=this
		if($(this.parent,'tree',true)==null)
		{
			var out='<ul class="Container" id="tree"><li class="Node IsRoot IsLast ExpandClosed"><div class="Expand"></div>\
					 <div class="imgfo"></div><div class="Content" p="root">'+self_.rfn+'</div><ul class="Container"></ul></li></ul>'
			$.create('div',{innerHTML:out},this.parent)
		}
		$(this.paren,'tree').on('click',function(event)
		{
			event = event || window.event
			var clickedElem = event.target || event.srcElement;
			
			if ($(clickedElem).hasclass('Content'))
			{
				if(clickedElem.getAttribute("p")=='root')self_.path='/';
				else self_.path=('/'+clickedElem.getAttribute("p")+clickedElem.innerText).replace('//','/');
				if(typeof self_.on.click !=='undefined')
				{
					self_.node={elm:clickedElem,name:clickedElem.innerHTML,root:clickedElem.getAttribute("p")=='root'?true:false}
					self_.on.click(self_)
				}
				return
			}
			if (!$(clickedElem).hasclass('Expand')){return}
			var node = clickedElem.parentNode;
			if ($(node).hasclass('ExpandLeaf')) {return}
			if (node.getElementsByTagName('LI').length)
			{
				self_.toggleNode(node);
				return
			}
			self_.path=('/'+$(node,'.Content',true)[0].getAttribute("p")+node.innerText).replace('//','/')
			if(typeof self_.on.clicktoggle !=='undefined')
			{
				self_.node={elm:node,name:node.innerHTML}
				self_.on.clicktoggle(self_)
			}
		})
	}
	Tree.prototype.addchild=function(node,under,cap,path,end,par)
	{
		if($(node).hasclass('ExpandClosed'))this.toggleNode(node,true)
		let ul=$(node,'>UL',true),li_=$(ul,'<li',true), li = {},img=under?'imgfo':'imgfi';
		path=path=='/'?path:'/'+path
		//LOG(ul)
		if(li_.length!=0)
		{
			let cls=li_[li_.length-1].className;
			li_[li_.length-1].className=cls.replace(' IsLast','')
		}
		li.className = "Node Expand" + (under==true ? 'Closed' : 'Leaf')+ ' IsLast'
		li.innerHTML = '<div class="Expand"></div><div class="'+img+'"></div><div class="Content" p="'+path+'">'+cap+'</div><ul class="Container"></ul>'
		li=$.create('LI',li,ul);
		(end)(ul,li,path+cap);
	}
	Tree.prototype.endNode=function(node)
	{
		let re =/(^|\s)(ExpandOpen|ExpandClosed|ExpandLeaf)(\s|$)/;
		node.className = node.className.replace(re, '$1'+'ExpandLeaf'+'$3');
	}
	Tree.prototype.toggleNode=function(node,par)
	{
		let newClass='';
		if(par==false) newClass = 'ExpandClosed';
		newClass = $(node).hasclass('ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen';
		let re =/(^|\s)(ExpandOpen|ExpandClosed|ExpandLeaf)(\s|$)/;
		node.className = node.className.replace(re, '$1'+newClass+'$3');
		$(node,'>div').toggleclass('rotated');
	}
	Tree.prototype.clear=function()
	{
		this.select=''
		this.zindex_=1
	}

	if ( typeof root === 'object' ) root.Tree = Tree;
})(this)