<strong>Change History</strong><br/><br/>
<div style="height:500px;overflow:auto">
<?
echo '<i>';
foreach($changes as $change) {
	if ($change['Change']['id'] == 0) {
		echo '</i><br/>**You are Here**<br/><br/>';
	}
	echo $html->link($change['Change']['description'],array('action'=>'jump',$change['Change']['id'])).'
	<br/>';
}
?>
</div>
