<fieldset>
	<legend><?php __('Change History');?></legend>
<div style="max-height:500px;overflow:auto">
<?
$user = Authsome::get('id');
echo '<div style="color:#CCCCCC">';
foreach($changes as $change) {
	if ($change['Change']['id'] == 0) {
		echo '</div><br/>';
	}
	echo $ajax->link($change['Change']['description'],array('action'=>'jump',$change['Change']['id']),array(
		'before' => "progress_start('{$user}')",
		'complete' => "window.location.reload()"
	)).'
	<br/>';
}
?>
</fieldset>
</div>
