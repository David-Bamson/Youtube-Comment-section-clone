const dot = document.getElementById('dot');
const report = dot.querySelector('.report-tooltip'); 

dot.addEventListener('click', () =>{
    if(report.style.display === 'none' || report.style.display === '') {
        report.style.display = 'inline-block';
    }
    else {
        report.style.display = 'none';
    }
});