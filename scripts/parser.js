(function () {
  "use strict";

  function qLog(text){
    // only find fullJSON once
    if (typeof qLog.element == 'undefined') {
      qLog.element = $("#fullJSON");
    }
    qLog.element.text(qLog.element.text() + "\n - " + text);
  }

  function newBaseEffect(index,name){
    var e = {};
    e.idx = index;
    e.nam = name;
    e.ing = [];
    
    return(e);
  }
  
  function getEffIdx(idx,effNam,ingIdx){
    var effIdx = idx.effL.length;
    // console.error(idx);
    console.log(effIdx);
    
    if(effNam in idx.effN){
      effIdx=idx.effN[effNam];
      console.info(effIdx);
    }else{
      idx.effN[effNam] = effIdx;
      idx.effL.push(newBaseEffect(effIdx,effNam));
    }

    console.log(effIdx);
    console.log(idx.effL);
    idx.effL[effIdx].ing.push(ingIdx);
    return(effIdx);
  }

  function parseEffInIng(idx,td,ing){
    var eff = {};
    eff.idx = -1;
    eff.nam = "";
    eff.val = 1;
    eff.mag = 1;

    eff.lix = $(td).hasClass("EffectPos");
    var tmpNam = "";
    var aCntr = 0;
    var size = [];
    $(td).find("font").each(function(){size.push($(this).find("b").text().trim());});
    $(td).find("a").each(function () {
      switch (aCntr++) {
        case 0: tmpNam = $(this).text().trim(); break; // usually initial image
        case 1: eff.nam = $(this).text().trim(); break;
        default: // absorb all the rest
          if ($(this).attr("title") === "Magnitude") { eff.mag = size.pop(); }
          if ($(this).attr("title") === "Value") { eff.val = size.pop(); }
          break;
      }
    });

    if(eff.nam===""){eff.nam=tmpNam;}
    eff.idx = getEffIdx(idx,eff.nam,ing);

    return (eff);
  }

  function parseIngTD(idx,rowTop, tdCnt, rowContent, props) {
    var qText = $(rowContent).text().trim();

    if (rowTop) {
      switch (tdCnt) {
        case 0: break; // images two rows high 
        case 1:
          var aFlds = 0;

          $(rowContent).find("a").each(function () {
            var aText = $(this).text().trim();
            switch (aFlds++) {
              case 0:
                props.nam = aText;
                break;
              case 1:
                  if(aText=="xx"){
                    props.dlc = "DB";
                  } else {
                    props.dlc = aText;
                  }
                break;
              default: /* heh */
            }

          });
          // could also extract ID from here
          break;

        case 2:
          props.src = qText;
          break;

        default: // do nothing
      }
    } else {
      switch (tdCnt) {
        case 0: /* fall through */
        case 1: /* fall through */
        case 2: /* fall through */
        case 3: props.eff.push(parseEffInIng(idx,rowContent,props.idx)); break;
        case 4: props.val = qText; break;
        case 5: props.wgt = qText; break;
        case 6: props.plt = qText; break;
        default: // do nothing
      }
    }
  }

  function newBaseIng(idx) {
    var p = {};
    p.idx = idx;
    p.nam = "";
    p.val = -1;
    p.wgt = -1;
    p.plt = -1;
    p.dlc = "none";
    p.eff = [];

    return (p);
  }

  function incMetric(metric,a,b,c){
    if(!metric.hasOwnProperty(a)){metric[a]={};}
    if(!metric[a].hasOwnProperty(b)){metric[a][b]={};}
    if(!metric[a][b].hasOwnProperty(c)){
      metric[a][b][c]=1;
    }else{
      ++metric[a][b][c];
    }
  }

  function parseIngFile(idx, fn) {
    return (
        $.ajax({
          url: fn,
          dataType: 'text',
          success: function (doc) {
            qLog("loaded ingredients source data");

            // source: http://stackoverflow.com/questions/15150264/jquery-how-to-stop-auto-load-imges-when-parsehtml
            var new_doc = doc.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) { return "<img no_load_src=\"" + capture + "\" />"; });
            var topHalf = true;
            var ingIdx = 0;
            var props = newBaseIng(ingIdx,0);
            //var skipper = 0;

            $("tr", new_doc).each(function () {
              var iterField = 0;

              $(this).find("td").each(function () {
                //if (skipper++ > 200)return; // TODO: remove this line
                parseIngTD(idx,topHalf, iterField++, this, props);
              });

              if(iterField === 0){return;} // no fields processed, must be a header row

              if (topHalf) {
                topHalf = false;
              } else {
                idx.ingL.push(props);
                idx.ingN[props.nam] = props.idx;
                incMetric(idx.metrics, "ing", "dlc", props.dlc );
                incMetric(idx.metrics, "ing", "plt", props.plt );
                props = newBaseIng(++ingIdx);
                topHalf = true;
              }
            });
            qLog("parsed ingredients data");
          },
          error: function (jqXHR, textStatus, errorThrown) { alert(textStatus); }
        })
    );
  }

  $(document).ready(function () {
    var idx = {};
    idx.ingL = [];
    idx.ingN = {};
    idx.effL = [];
    idx.effN = {};
    idx.metrics = {};

    // fullJSON.text( JSON.stringify( idx ));
    // source: http://stackoverflow.com/questions/3709597/wait-until-all-jquery-ajax-requests-are-done
    $.when(
        parseIngFile(idx, "source_data/simple_www.uesp.net_wiki_Skyrim_Ingredients.html")
    ).done(function (p1) {
      // indexIngData( idx );
      $("#fullJSON").text("/* autogenerated content -- DO NOT MODIFY\n" +
          " * to change this data you must:\n" +
          " * 1. edit scripts/parser.js\n" +
          " * 2. load parser.html\n" +
          " * 3. paste the content into scripts/index.js\n" +
          " */\n\n" +
          "function getIdx() { return(" +
          JSON.stringify(idx, null, ' ') +
          "\n);}");
      
      if(JSON.stringify(idx)!==JSON.stringify(getIdx())){
        alert("idx has changed");
        console.error("idx has changed");
      }
    });
  });


  /*
   $(document).ready(function(){
   var idx = getIdx();
   var ingList = $("#ingredients");
   $.each( idx.ip, function( index, value ) {
   ingList.append(
   "<li data-role=\"presentation\" data-idx="+index+">"
   + "<span class=\"label label-default\">"
   + value.name
   + "</span></li>" );
   });
   });
   */
}());
// vim: set ts=2 sw=2 et:
