@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
<?php $ages = array("I","II","III","IV","V","VI","VII","VIII","IX","X",
"XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX",
"XXI","XXII","XXIII","XXIV","XXV","XXVI","XXVII","XXVIII","XXIX","XXX",
"XXXI","XXXII","XXXIII","XXXIV","XXXV")?>

<?php $overviesChronomaps = array(
	array('from'=>'-3500','to'=>'-500','label'=>'Раняя история<br>(В процессе)<br>Шаг по времени - 100 лет','dateMode'=>'age','done'=>2),	
	array('from'=>'-500','to'=>'1648','label'=>'Античность и Средние века(В планах)<br>Шаг по времени - 10 лет','dateMode'=>'age','done'=>0),	
        array('from'=>'1200','to'=>'1300','label'=>'XIII век(В процессе)','dateMode'=>'age','done'=>2),	
	array('from'=>'1648','to'=>'2016','label'=>'Новая и новейшая история(В планах)<br>Шаг по времени - 1 год','dateMode'=>'age','done'=>0),	
	);
?>

<?php $detailChronomaps = array(
	array('from'=>'-221','to'=>'-202','label'=>'Вторая Пуническая война','dateMode'=>'month','done'=>1),
	array('from'=>'-336','to'=>'-323','label'=>'Александр Македонский','dateMode'=>'month','done'=>1),
	array('from'=>'1492','to'=>'1504','label'=>'Колумб','dateMode'=>'month','done'=>1),
	array('from'=>'1917','to'=>'1923','label'=>'Гражданская война в России','dateMode'=>'month','done'=>1),
	);
?>

<?php $colors = array('0'=>'#777','1'=>'#f77','2'=>'#757') ?>

<p>
Сейчас занимаемя картой "XIII век", которая потом войдёт в карту "Античность и Средние века".<br>
О планах написано в <a target='_blank' href='http://outlander-yy.livejournal.com/4025.html'>блоге</a>.<br><br>
Хронокарты на временной шкале:
</p>

<div style='height:30px;'>
	<div style='position:absolute;left:70px'>Век</div>
	<div style='position:absolute;left:200px'>Обзорные карты</div>
	<div style='position:absolute;left:400px'>Детальные карты</div>
</div>
<div style='display:inline-block;position:relative'>
<?php for($i=-35;$i<=21;$i++) :?>
	<?php if ($i ==0) continue;?>
	<div style='height:20px;background-color:<?php echo $i%2 ==0 ? '#262': '#555'?>;width:100px'>
	<?php echo $i < 0 ? $ages[-$i-1]." до н.э." : $ages[$i-1]." н.э."?>
	</div>
<?php endfor?>

<?php foreach($overviesChronomaps as $chronomap) :?>
<div style='border:<?php echo $chronomap['dateMode'] != 'month' ? 1 : 0 ?>px solid #000;position:absolute;height:<?php echo ($chronomap['to']-$chronomap['from'])/100 * 20?>px;background-color:<?php echo $colors[$chronomap['done']] ?>;width:200px;top:<?php echo ($chronomap['from']+3500)/100 * 20?>px;left:150px'>
	<?php echo $chronomap['label']?>
</div>
<?php endforeach?>

<?php foreach($detailChronomaps as $chronomap) :?>
<div style='border:<?php echo $chronomap['dateMode'] != 'month' ? 1 : 0 ?>px solid #000;position:absolute;height:<?php echo ($chronomap['to']-$chronomap['from'])/100 * 20?>px;background-color:<?php echo $colors[$chronomap['done']] ?>;width:200px;top:<?php echo ($chronomap['from']+3500)/100 * 20?>px;left:370px'>
	<?php echo $chronomap['label']?>
</div>
<?php endforeach?>
</div>
  

@endsection
