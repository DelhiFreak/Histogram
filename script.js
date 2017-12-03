baseurl = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query="
format = "&format=json&sort_cited=y&pageSize=1000&cursorMark=" //&resulttype=idlist
cursorMark= "*"

lpc = 1;

papers_count = []
best_paper = {}
years = []

function yearsList()
{
  s = parseInt($("#s").val())
  e = parseInt($("#e").val())
  list = []
  for(let i=s;i<=e;i++)
    {
     list.push(i)
     papers_count[i-s] = 0
     best_paper[i-s] = {citedByCount: 0, title:'', journalTitle:''}
    }
  return list
}

function formatter(){
  return 'The value for <b>'+ this.x + '</b> is <b>'+ this.y +'</b>';
}

function batch(ncm){
  $.get(baseurl + t + format + ncm,
      (data, status) => {
        lpc = data.resultList.result.length;
        filteredResults = data.resultList.result.filter(el => el.pubYear >= s && el.pubYear <= e)

        filteredResults.forEach( res => {
          papers_count[parseInt(res.pubYear) - parseInt(s) ]++;
          if(res.citedByCount > best_paper[parseInt(res.pubYear) - parseInt(s)].citedByCount)
            best_paper[parseInt(res.pubYear) - parseInt(s)] = res
          })
          //  + best_paper['{point.x}'].journalTitle +
          Highcharts.chart('container', {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'Number of papers published'
              },
              subtitle: {
                  text: 'Each year'
              },
              xAxis: {
                  categories: years,
                  crosshair: true
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'Papers Published'
                  }
              },
              tooltip:
              {
                formatter: function () {
                    var total = '<b>' + this.x + '</b>';
                    var year = this.x;
                        $.each(this.points, function (i, point) {
                            // var total = point.y + best_paper[year];
                            total += '<br/>' + point.series.name + ': <b>' + point.y +'</b>';
                            total += '<br/> Paper Title: <b>' + best_paper[parseInt(point.x) - s].title + '</b>';
                            total += '<br/> Author Name: <b>' + best_paper[parseInt(point.x) - s].authorString + '</b>';
                        });
                    return total;
                },
                shared: true
              },
              // {
              //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              //     pointFormat:
              //     '<tr><td style="color:{series.color};padding:0">Best paper: </td><td style="padding:0"><b> point.best_paper.journalTitle </b></td></tr>'+
              //         '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              //         '<td style="padding:0"><b>{point.y}</b></td></tr>',
              //     footerFormat: '</table>',
              //     shared: true,
              //     useHTML: true
              // },
              plotOptions: {
                  column: {
                      pointPadding: 0.2,
                      borderWidth: 0
                  }
              },
              series: [{
                  name: 'Papers count',
                  data: papers_count,
                  best_paper: best_paper,
              }]
          });

        if(lpc > 0)
          batch(data.nextCursorMark);
    })
}

$("#trigger").click(() => {

  t = $("#t").val()
  s = $("#s").val()
  e = $("#e").val()

  years = yearsList()
  batch('*')



})

/*
  https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=
  format=json
  sort_cited:y
  resulttype=idlist

*/
