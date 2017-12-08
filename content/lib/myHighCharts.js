/*
  * MyHighCharts���󣬷�װ��highcharts����
  *
  * �ӿ�.�������˵�����������
  *
  * createLineChart ��������ͼ
  * createPieChart  ������״ͼ
  * createColumnChart ������״ͼ
  * showChart ��ʾͼ��
  *
  * ���ӣ�
  * ����
  * var mychart = new MyHighCharts("chartDiv");
  * mychart.createPieChart("this is a piechart");
  * mychart.showChart(titleArray, dataArray);
  *
  *
  * Highcharts.getOptions().colors[3]�����׼��ɫ
  */
  
 /*����highcharts�������� */
// document.write("<script type='text/javascript' src='/file/html/content/lib/highcharts/highcharts.js'></script>");
// document.write("<script type='text/javascript' src='/file/html/content/lib/highcharts/highcharts-more.js'></script>");
// document.write("<script type='text/javascript' src='/file/html/content/lib/highcharts/themes/grid.js'></script>");
  
  /* brief: ����ͼ��
   * chartDiv: ͼ������
  */
 function MyHighCharts(chartDiv) {
    this.chart = null;
    this.chartType = 0; /*ͼ������0:����ͼ, 1:��״ͼ, 2:��״ͼ, 3:�Ǳ�ͼ*/
    this.chartDiv = chartDiv;
    this.pieRateName = ""; // ��״ͼ����ռ��������

    var _yAxisType = 0; /*�������ʾ��ʽ��0:�����1:����*/
    this._columnType = 0; /*��״ͼ��ʽ��0:��׼��1:��ϣ�����֮���޼�϶������һ�㻹�����߻��ͼ*/
    this._columnSameColor = true; /*�����Դֻ��һ��ʱ����״ͼ�Ƿ�ͬһ��ɫ��Ĭ����true*/
    var _colors = [
	    '#FFFF00', 
	    '#FF4643', 
	    '#66A54E', 
	    '#80699B', 
	    '#3D96AE', 
	    '#DB843D', 
	    '#92A8CD', 
	    '#A47D7C', 
	    '#B5CA92'
	];
 
     /*�������������ʽչʾ*/
     this.optionXAxisDatetime = {
         type: 'datetime'
     };
     
     /*�������������ʽչʾ*/
     this.optionXAxisLinear = {
         categories: [], 
         labels: {
             //rotation: -45,
             align: 'right',
             style: {
                 fontSize: '11px', 
                 fontWeight: '', 
                 fontFamily: 'Verdana, sans-serif'
             }
         }
     };
     
     /*��׼��״ͼ*/
     this.optionColumnNormal = {
         stacking: '',
         pointPadding: 0.1,
         borderWidth: 0
     };
     
     /*�����״ͼ*/
     this.optionColumnGroup = {
         stacking: '',
         borderWidth: 0,
         groupPadding: -0.124 /*���������״ͼ֮��Ŀ�϶*/
     };
     
     /* ����ͼ*/
	 this.optionsLineChart = {
		chart: {
		    renderTo: chartDiv,
			defaultSeriesType: 'line',
			backgroundColor:"#FFFFFF",
			plotBackground:'#FFFFFF',
			zoomType: 'x',
			borderRadius: 0,
			  borderWidth: 0,
		},
		credits:{
			enable:false,
			href:'',
			text:''
		},
		title: {
		    text: '',
			x: -20
		},
	    xAxis: {
		},
		yAxis: {
		    title: {
		        text: ''
		    },
            min: 0
        },
		tooltip: {
			crosshairs: true,
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            line: {
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 2
                    }
                },
                marker: {
                    enabled: false
                }
            }
        },
		exporting: {
			enabled:false
		},
		series:[]
	};
	
    /* ��״ͼ*/
	this.optionsPieChart = {
		chart: {
			renderTo: chartDiv,
			type: 'pie',
			backgroundColor:"#FFFFFF",
			plotBackgroundColor:'#FFFFFF',
            plotBorderWidth: null,
            plotShadow: false,
			borderRadius: 0,
			  borderWidth: 0,
		},
		credits:{
			enable:false,
			href:'',
			text:''
		},
		title: {
			text: '',
			x: -20
		},
		tooltip: {
		    formatter: function() {
                return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage*100)/100 +' %';
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000',
                    connectorColor: '#000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage*100)/100 +' %';
                    }
                }, 
                showInLegend: true
            }
        },
		series:[]
	};
	
	/*��״ͼ*/
	this.optionsColumnChart = {
		chart: {
		    renderTo: chartDiv,
			type: 'column',
			zoomType: 'y',
			backgroundColor:"#FFFFFF",
			plotBackgroundColor:'#FFFFFF',
			borderRadius: 0,
			  borderWidth: 0,
		},
		credits:{
			enable:false,
			href:'',
			text:''
		},
		legend: {
		    enabled: true
		},
		title: {
		    text: '',
			x: -20
		},
		xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0,
            stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
            }
        },
		series:[]
	};
	
	/*�Ǳ�ͼ*/
	this.optionGaugeChart = {
	    chart: {
	        renderTo: chartDiv,
	        type: 'gauge',
	        margin: [0, 0, 0, 0],
	        plotBackgroundColor: null,
	        plotBackgroundImage: null,
	        plotBorderWidth: 0,
	        borderRadius: 0
	    },
	    
	    title: {
	        text: ''
	    },
	    
	    pane: {
	        startAngle: -90,
	        endAngle: 90,
	        background: null,
	        center: ['50%', '98%'],
	    },
	    
	    yAxis: {
	        min: 0,
	        max: 100,
	        lineColor: '#000',
	        
	        minorTickInterval: 'auto',
	        minorTickWidth: 1,
	        minorTickLength: 3,
	        minorTickPosition: 'inside',
	        minorTickColor: '#000',
	        
	        tickPixelInterval: 50,
	        tickWidth: 2,
	        tickPosition: 'inside',
	        tickLength: 6,
	        tickColor: '#000',
	        labels: {
	            style: {
                    color:'#fff',
                    fontWeight: '600'
                    },
	            distance: 15,
	            rotation: 'auto'
	        },
	        title: {
	            text: ''
	        }       
	    },
	    
	    plotOptions: {
	        gauge: {
	    		dataLabels: {
	    			enabled: true,
	    			color: '#f00',
	    			borderWidth: 0,
	    			format: '{y}',
	    			x: 0,
	    			y: -32
	    		},
	    		dial: {
	    		    backgroundColor: '#000',
	    			radius: '70%',
	    			baseWidth: 3,
	    			topWidth: 1
	    		}
	    	}
	    },
	    
	    series: [{
	        name: '',
	        data: [30],
	        tooltip: {
	            valueSuffix: ''
	        }
	    }]
	};
	
	/* brief: ��������ͼ
	 * chartTitle: ͼ����
	 * suffix: ��λ
	 * yAxisType: �������ʾ��ʽ��0:�����1:����
	 * xAxistype:  �������ʾ��ʽ��������0:datetime��1:linear.ǰ����Ҫ����ʱ��������ʼʱ�䣻������Ҫ�������������
	 * pointInterval: ����ʱ��,����datatime
	 * pointStart: ����ʼʱ��,����datatime
	 * xCategoriesArray: ����������飬����linear
	 */
	this.createLineChart = function (chartTitle, suffix, yAxisType, xAxistype, pointInterval, pointStart, xCategoriesArray) {
	    var theHtml = document.getElementById(this.chartDiv);
	    if(theHtml != null) theHtml.innerHTML = "";

        _yAxisType = yAxisType;
	    this.chart = null;
	    this.chartType = 0;
	    this.optionsLineChart.series = [];
	    this.optionsLineChart.xAxis = null;

	    this.optionsLineChart.title.text = chartTitle;
	    this.optionsLineChart.tooltip.pointFormat = '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} ' + suffix + '</b></td></tr>';

	    if (0 == xAxistype) {
	        this.optionsLineChart.xAxis = this.optionXAxisDatetime;
	        this.optionsLineChart.plotOptions.line.pointInterval = pointInterval;
			this.optionsLineChart.plotOptions.line.pointStart = pointStart;
	    }
	    else {
	    	
	        this.optionXAxisLinear.categories = [];
	        this.optionsLineChart.xAxis = this.optionXAxisLinear;
	        
			for (var i = 0; i < xCategoriesArray.length; i++){
				
			    this.optionsLineChart.xAxis.categories.push(xCategoriesArray[i]);
			}
			
	    }
	}
	
	/* brief: ����������ƣ�ֻӦ���ڵ�����
	 * yTitle: �������
	 */
	this.setYAxisTitle = function (yTitle) {
	    this.optionsLineChart.yAxis.title.text = yTitle;
	}
	
	/* brief: ������״ͼ
	 * chartTitle: ͼ��
	 * pieRateName
	 */
	this.createPieChart = function (chartTitle, pieRateName) {
	    var theHtml = document.getElementById(this.chartDiv);
	    if(theHtml != null) theHtml.innerHTML = "";
	    
	    this.chart = null
	    this.chartType = 1;
	    this.pieRateName = pieRateName;
	    this.optionsPieChart.series = [];
	    this.optionsPieChart.title.text = chartTitle;
	}
	
	/* brief: ������״ͼ
	 * columnType: ��״ͼ���ͣ�0����׼��1�����
	 * stack: �Ƿ�������false,true
	 * chartTitle: ͼ��
	 * yTitle: ���������
	 * suffix: ��λ
	 * xAxistype:  �������ʾ��ʽ��������0:datetime��1:linear.ǰ����Ҫ����ʱ��������ʼʱ�䣻������Ҫ�������������
	 * pointInterval: ����ʱ��,����datatime
	 * pointStart: ����ʼʱ��,����datatime
	 * xCategoriesArray: ���������
	 * columnSameColor: ��״ͼ�Ƿ�Ϊͬһ��ɫ��Ĭ��Ϊtrue
	 * valueShow:true false 是否显示值
	 */
	this.createColumnChart = function (columnType, stack, chartTitle, yTitle, suffix, xAxistype, pointInterval, pointStart, xCategoriesArray, columnSameColor,valueShow) {
	    var theHtml = document.getElementById(this.chartDiv);
	    if(theHtml != null) theHtml.innerHTML = "";
	    
	    this.chart = null;
	    this.chartType = 2;
	    this._columnType = columnType;
	    this._columnSameColor = columnSameColor;
	    this.optionsColumnChart.xAxis = null;
        this.optionsColumnChart.series = [];
        this.optionsColumnChart.plotOptions.column.pointInterval = 1;
        this.optionsColumnChart.plotOptions.column.pointStart = 0;
        
	    this.optionsColumnChart.title.text = chartTitle;
	    this.optionsColumnChart.yAxis.title.text = yTitle;
	    if(valueShow){
	    	this.optionsColumnChart.yAxis.stackLabels={enabled: true};
	    }else{
	    	this.optionsColumnChart.yAxis.stackLabels={enabled: false};
	    }
	    
	    
	    this.optionsColumnChart.tooltip.pointFormat = '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} ' + suffix + '</b></td></tr>';
	    
	    if (stack) {
	        this.optionColumnNormal.stacking = 'normal';
	        this.optionColumnGroup.stacking = 'normal';
//	        this.optionColumnNormal.dataLabels={ enabled: false};
	    }
	    
	    if (0 == columnType) {
            this.optionsColumnChart.plotOptions.column = this.optionColumnNormal;
	    }
	    else {
	        this.optionsColumnChart.plotOptions.column = this.optionColumnGroup;
	    }
	    
	    if (0 == xAxistype) {
	        this.optionsColumnChart.xAxis = this.optionXAxisDatetime;
	        this.optionsColumnChart.plotOptions.column.pointInterval = pointInterval;
			this.optionsColumnChart.plotOptions.column.pointStart = pointStart;
	    }
	    else {
	        this.optionXAxisLinear.categories = [];
	        this.optionsColumnChart.xAxis = this.optionXAxisLinear;
			for (var i = 0; i < xCategoriesArray.length; i++){
			    this.optionsColumnChart.xAxis.categories.push(xCategoriesArray[i]);
			}
	    }
	}
	
	/* brief: �����Ǳ�ͼ
	 * startAngle: ��ʼ�Ƕ�
	 * endAngle: ����Ƕ�
	 * min: ��Сֵ
	 * max: ���ֵ
	 * chartTitle: ����
	 * seriesName: �����
	 * suffix: ��׺
	 */
	 this.createGaugeChart = function (startAngle, endAngle, min, max, chartTitle, seriesName, suffix) {
	     this.chartType = 3;
	     this.optionGaugeChart.pane.startAngle = startAngle;
	     this.optionGaugeChart.pane.endAngle = endAngle;
	     this.optionGaugeChart.yAxis.min = min;
	     this.optionGaugeChart.yAxis.max = max;
	     this.optionGaugeChart.title.text = chartTitle;
	     this.optionGaugeChart.series[0].name = seriesName;
	     this.optionGaugeChart.series[0].tooltip.valueSuffix = ' ' + suffix;
	     this.optionGaugeChart.plotOptions.gauge.dataLabels.format += ' ' + suffix;
	 }
	 
	 /* brief: �����Ǳ�ͼѡ��
	 * bgImgPath: ����ͼ·��
	 * bgImgWidth: ����ͼ���
	 * bgImgHeight: ����ͼ�߶�
	 * size: �Ǳ��̴�С(��180)
	 * size: ����
	 * seriesName: �����
	 * suffix: ��׺
	 */
	 this.setGaugeOption = function (bgImgPath, bgImgWidth, bgImgHeight, size) {
	     this.optionGaugeChart.chart.plotBackgroundImage = bgImgPath;
	     this.optionGaugeChart.chart.width = bgImgWidth;
	     this.optionGaugeChart.chart.height = bgImgHeight;
	     this.optionGaugeChart.pane.size = size;
	 }
	
	/* brief: ��ʾͼ��
	 * titileArray: ����������
	 * dataArray: �������,ÿ���������:d1,d2,d3,d4
	 * type: ����������飬����������ݵ����ͣ���line,spline,column�ȣ��������ͼ��
	 */
	this.showChart = function (titileArray, dataArray, typeArray) {
	    if (this.chart) {
	        this.chart = null;
	    }
	    
	    switch (this.chartType) {
	    case 0:/*����ͼ*/
	        {
	            var yaxisNum = titileArray.length;
	            /*0Ϊ����*/
	            if (0 == _yAxisType) {
	                for (var i = 0; i < yaxisNum; i++ ) {
		                var dataStr="{name:'" + titileArray[i] + "', data:[" + dataArray[i] + "]}";
		                var data = eval("("+dataStr+")");
	                    this.optionsLineChart.series.push(data);
	                }
	                
	            }
	            else {
	                this.optionsLineChart.yAxis = [];
	                for (var i = 0; i < yaxisNum; i++) {
                        var yaxisstr = "{lineColor: '" + Highcharts.getOptions().colors[i] + "',lineWidth: 1,title:{text:'" + titileArray[i] + "'}";
	  		            if (i < yaxisNum/2) {
	  		                yaxisstr += "}";
	  		            }
	  		            else {
	  			            yaxisstr += ", opposite:true}";
	  		            }
	  		            
	    	            var tempyaxis = eval("("+yaxisstr+")");
	    	            this.optionsLineChart.yAxis.push(tempyaxis);
	    	            
	    	            var dataStr="{color: '" + Highcharts.getOptions().colors[i] +"', name:'" + titileArray[i]+"',data:[" + dataArray[i]+"],yAxis:"+i+"}";
				        var data = eval("("+dataStr+")");
	    		        this.optionsLineChart.series.push(data);
	                }
	            }

	            this.chart = new Highcharts.Chart(this.optionsLineChart);
	        }
	    	break;
	    case 1:/*��״ͼ*/
	        {
	            var yaxisNum = titileArray.length;
	            var dataStr="{type: 'pie', name: '" + this.pieRateName + "', data:[";
	            for (var i = 0; i < yaxisNum; i++ ) {
		            dataStr += "['" + titileArray[i] + "', " + dataArray[i]+"],";
	            }
	            dataStr += "]}";
                var data = eval("("+dataStr+")");
	            this.optionsPieChart.series.push(data);
	            
	            this.chart = new Highcharts.Chart(this.optionsPieChart);
	        }
	    	break;
	    case 2:/*��״ͼ*/
	        {
	            var yaxisNum = titileArray.length;
	            for (var i = 0; i < yaxisNum; i++ ) {
	                var dataStr;
	                
	                /*��׼ͼ*/
	                if (0 == this._columnType) {
	                    if (this._columnSameColor) {/*ͬһ��ɫ*/
	                        dataStr="{name:'" + titileArray[i] + "', data:[" + dataArray[i] + "]}";
	                    }
	                    else {
	                        this.optionsColumnChart.legend.enabled = false;
	                        dataStr="{name:'" + titileArray[i] + "', data:[";
	                        var arr = dataArray[i].split(',');
	                        for (var j = 0; j < arr.length; j++) {
	                            dataStr += "{y:" + arr[j] +", color:'" + Highcharts.getOptions().colors[j] + "'}";
	                            if (j != arr.length - 1) {
	                                dataStr += ",";
	                            }
	                        }
	                        dataStr += "]}";
	                    }
	                }
	                else {/*���ͼ*/
		                dataStr="{type:'" + typeArray[i] + "', name:'" + titileArray[i] + "', data:[" + dataArray[i] + "]";
		            
		                /*���Ϊ����ʱ��Ҫ��������һ��marker*/
		                if (typeArray[i] == 'line' || typeArray[i] == 'spline') {
		                    dataStr += ", marker: {enabled: false, lineWidth: 1, lineColor: Highcharts.getOptions().colors[3], fillColor: 'white'} }";
		                }
		                else {
		                    dataStr += "}";
		                }
	                }

		            var data = eval("("+dataStr+")");
	                this.optionsColumnChart.series.push(data);
	            }
	            
	            this.chart = new Highcharts.Chart(this.optionsColumnChart);
	        }
	        break;
	    case 3: /*�Ǳ���*/
	    {
	        this.chart = new Highcharts.Chart(this.optionGaugeChart);
	    }
	        break;
	    default:
	        break;
	    }
	}
	
	/* brief: ����ͼ����ֵ
	 * newValue: ��ֵ
	 */
	this.updateValue = function (newValue) {
	    var point = this.chart.series[0].points[0];
	    point.update(newValue);
	 }
}