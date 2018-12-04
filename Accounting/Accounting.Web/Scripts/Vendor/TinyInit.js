tinymce.init({
	selector: "textarea.simple_editor",
	plugins: [
	  "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
	  "searchreplace wordcount visualblocks visualchars code insertdatetime media nonbreaking fullscreen",
	  "table contextmenu directionality emoticons template textcolor paste" //fullpage
	],
	toolbar1: "formatselect styleselect | bold italic underline strikethrough link | subscript superscript | alignleft aligncenter alignright",
	toolbar2: "bullist numlist | outdent indent | blockquote hr | table | removeformat visualblocks | code fullscreen",
	toolbar3: "",
	menubar: false,
	toolbar_items_size: 'small',
	style_formats: [
	  { title: 'Highlight', inline: 'span', styles: { color: 'yellow' } },
	  { title: 'Alert', block: 'h1', styles: { color: '##ff0000' } }
	]
});