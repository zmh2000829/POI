import React, {Component} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts-wordcloud';
import ElResize from './el-resize';

class WordCloud extends Component {
    constructor(props) {
        super(props);
        this.chart = null;
    }

    componentDidMount() {
        this.draw(this.props.words);
    }

    componentWillUnMount() {
        this.destroy();
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(this.props.words, nextProps.words)) {
            this.draw(nextProps.words);
        }
        return false;
    }

    destroy = () => {
        if(this.chart) {
            this.chart.dispose && this.chart.dispose();
            this.chart = null;
        }
    }

    resize = () => {
        if(this.chart) {
            this.chart.resize();
        }
    }

    draw = (words) => {
        if(!words || !words.length) {
            this.destroy();
            this.refs['word-cloud'].innerHTML = '<div class="no-data-tip">No data</div>';
            return;
        } else if(!this.chart) {
            this.chart = echarts.init(this.refs['word-cloud']);
        }
        this.chart.setOption({
            tooltip: {},
            series: [{
                type: 'wordCloud',
                shape: 'circle',
                sizeRange: [20, 60],
                rotationRange: [-90, 90],
                rotationStep: 90,
                width: '100%',
                height: '100%',
                left: 'center',
                top: 'center',
                gridSize: 10,
                drawOutOfBound: false,
                textStyle: {
					normal: {
						fontWeight: 'bold',
						color: function() {
							return 'rgb(' + [
								Math.round(Math.random() * 160),
		                        Math.round(Math.random() * 160),
		                        Math.round(Math.random() * 160)
							].join(',') + ')';
						}
					},
					emphasis: {
						shadowBlur: 5,
						shadowColor: '#333'
					}
				},
				data: words
            }]
        });
    }

    render() {
        return (
            <ElResize resize={this.resize}>
                <div ref="word-cloud" className="word-cloud" style={{width: '100%', height: '100%'}}>
                </div>
            </ElResize>
        );
    }
}

export default WordCloud;
