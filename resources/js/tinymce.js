export default function tinyeditor({
	state,
	statePath,
	selector,
	plugins,
	external_plugins,
	toolbar,
	language = "en",
	language_url = null,
	directionality = "ltr",
	height = null,
	max_height = 0,
	min_height = 100,
	width = null,
	max_width = 0,
	min_width = 400,
	resize = false,
	skin = "oxide",
	content_css = "default",
	skin_dark = null,
	content_css_dark = null,
	skin_light = null,
	content_css_light = null,
	toolbar_sticky = true,
	toolbar_sticky_offset = 64,
	toolbar_mode = 'sliding',
	toolbar_location = 'auto',
	inline = false,
	toolbar_persist = false,
	menubar = false,
	font_size_formats = "",
	fontfamily = "",
	relative_urls = true,
	image_list = null,
	image_advtab = false,
	image_description = false,
	image_class_list = null,
	images_upload_url = null,
	images_upload_base_path = null,
	remove_script_host = true,
	convert_urls = true,
	component_key = null,
	file_attachments = false,
	file_attachments_accepted_types = [],
	file_attachments_max_size = null,
	allow_file_drop = true,
	prefer_pasted_image_files = false,
	custom_configs = {},
	setup = null,
	disabled = false,
	locale = "en",
	license_key = "gpl",
	placeholder = null,
	removeImagesEventCallback = null,
}) {
	let editors = window.filamentTinyEditors || {};
	return {
		id: null,
		state: state,
		statePath: statePath,
		selector: selector,
		language: language,
		language_url: language_url,
		directionality: directionality,
		height: height,
		max_height: max_height,
		min_height: min_height,
		width: width,
		max_width: max_width,
		min_width: min_width,
		resize: resize,
		skin: skin,
		content_css: content_css,
		skin_dark: skin_dark,
		content_css_dark: content_css_dark,
		skin_light: skin_light,
		content_css_light: content_css_light,
		themeHandler: null,
		plugins: plugins,
		external_plugins: external_plugins,
		toolbar: toolbar,
		toolbar_sticky: toolbar_sticky,
		menubar: menubar,
		relative_urls: relative_urls,
		remove_script_host: remove_script_host,
		convert_urls: convert_urls,
		font_size_formats: font_size_formats,
		fontfamily: fontfamily,
		setup: setup,
		image_list: image_list,
		image_advtab: image_advtab,
		image_description: image_description,
		image_class_list: image_class_list,
		images_upload_url: images_upload_url,
		images_upload_base_path: images_upload_base_path,
		license_key: license_key,
		component_key: component_key,
		file_attachments: file_attachments,
		file_attachments_accepted_types: file_attachments_accepted_types,
		file_attachments_max_size: file_attachments_max_size,
		allow_file_drop: allow_file_drop,
		prefer_pasted_image_files: prefer_pasted_image_files,
		custom_configs: custom_configs,
		updatedAt: Date.now(),
		disabled,
		locale: locale,
		placeholder: placeholder,
		removeImagesEventCallback,
		init() {
			this.delete();

			this.initEditor(state.initialValue);

			window.filamentTinyEditors = editors;

			// Follow the panel's light/dark switch without a reload: the skin
			// is baked into the TinyMCE config, so re-init with the other pair.
			// Only when the caller supplies both skins.
			if (skin_dark && skin_light) {
				this.themeHandler = (event) => {
					const theme = event.detail;
					const dark = theme === "dark"
						|| (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
					const nextSkin = dark ? skin_dark : skin_light;
					if (nextSkin === this.skin) return;
					this.skin = nextSkin;
					this.content_css = dark ? (content_css_dark ?? content_css) : (content_css_light ?? content_css);
					const current = this.editor()?.getContent() ?? this.state;
					this.delete();
					this.initEditor(current);
				};
				window.addEventListener("theme-changed", this.themeHandler);
			}

			this.$watch("state", (newState, oldState) => {
				if (newState === "<p></p>" && newState !== this.editor()?.getContent()) {
					if (this.editor()) {
						this.editor().destroy();
					}
					this.initEditor(newState);
				}

				if (this.editor()?.container && newState !== this.editor()?.getContent()) {
					this.updateEditorContent(newState || "");
					this.putCursorToEnd();
			}
			});
		},
		editor() {
			return tinymce.get(editors[this.statePath]);
		},
		initEditor(content) {
			let _this = this;
			let $wire = this.$wire;

			const defaultFontFamilyFormats = "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n";
    		const fontFamilyFormats = fontfamily || defaultFontFamilyFormats;

			const defaultFontSizeFormats = "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt";
			const fontSizeFormats = font_size_formats || defaultFontSizeFormats;

			const tinyConfig = {
				selector: selector,
				language: language,
				language_url: language_url,
				directionality: directionality,
				statusbar: false,
				promotion: false,
				height: height,
				max_height: max_height,
				min_height: min_height,
				width: width,
				max_width: max_width,
				min_width: min_width,
				resize: resize,
				skin: this.skin,
				content_css: this.content_css,
				plugins: plugins,
				external_plugins: external_plugins,
				toolbar: toolbar,
				toolbar_sticky: toolbar_sticky,
				toolbar_sticky_offset: toolbar_sticky_offset,
				toolbar_mode: toolbar_mode,
				toolbar_location: toolbar_location,
				inline: inline,
				toolbar_persist: toolbar_persist,
				menubar: menubar,
				menu: {
					file: {
						title: "File",
						items:
							"newdocument restoredraft | preview | export print | deleteallconversations",
					},
					edit: {
						title: "Edit",
						items:
							"undo redo | cut copy paste pastetext | selectall | searchreplace",
					},
					view: {
						title: "View",
						items:
							"code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments",
					},
					insert: {
						title: "Insert",
						items:
							"image link media addcomment pageembed codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime",
					},
					format: {
						title: "Format",
						items:
							"bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat",
					},
					tools: {
						title: "Tools",
						items:
							"spellchecker spellcheckerlanguage | a11ycheck code wordcount",
					},
					table: {
						title: "Table",
						items:
							"inserttable | cell row column | advtablesort | tableprops deletetable",
					},
					help: { title: "Help", items: "help" },
				},
				font_size_formats: fontSizeFormats,
				fontfamily: fontFamilyFormats,
				font_family_formats: fontFamilyFormats,
				relative_urls: relative_urls,
				remove_script_host: remove_script_host,
				convert_urls: convert_urls,
				image_list: image_list,
				image_advtab: image_advtab,
				image_description: image_description,
				image_class_list: image_class_list,
				images_upload_url: images_upload_url,
				images_upload_base_path: images_upload_base_path,
				license_key: license_key,

				...custom_configs,

				// Pasted data images are kept only when the field accepts file attachments.
				paste_data_images: file_attachments,

				setup: function (editor) {
					if (!window.tinySettingsCopy) {
						window.tinySettingsCopy = [];
					}

					if (
						editor.settings &&
						!window.tinySettingsCopy.some(
							(obj) => obj.id === editor.settings.id
						)
					) {
						window.tinySettingsCopy.push(editor.settings);
					}

					editor.on("blur", function (e) {
						_this.updatedAt = Date.now();
						_this.state = editor.getContent();
					});

					editor.on("change", function (e) {
						_this.updatedAt = Date.now();
						_this.state = editor.getContent();
					});

					editor.on("init", function (e) {
						editors[_this.statePath] = editor.id;
						if (content != null) {
							editor.setContent(content);
						}
					});

					editor.on("OpenWindow", function(e) {
						let target = e.target.container.closest(".fi-modal");
						if (target){
							target.setAttribute("x-trap.noscroll", "false");
						}
					});

					editor.on("CloseWindow", function(e) {
						let target = e.target.container.closest(".fi-modal");
						if (target){
							target.setAttribute("x-trap.noscroll", "isOpen");
						}
					});

					if (!allow_file_drop) {
						// A dropped file never goes into the body; text and links still drop normally.
						editor.on("drop", (e) => {
							if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
								e.preventDefault();
							}
						});
					}

					if (prefer_pasted_image_files && file_attachments) {
						// Teams and browsers put an <img> to a remote URL on the clipboard next to the image file; upload the file instead.
						editor.on("paste", (e) => {
							const data = e.clipboardData;
							if (!data) {
								return;
							}
							const html = data.getData("text/html");
							const files = Array.from(data.items || [])
								.filter((item) => item.kind === "file" && (file_attachments_accepted_types.length === 0 || file_attachments_accepted_types.includes(item.type)))
								.map((item) => item.getAsFile())
								.filter((file) => file !== null);
							if (!html || files.length === 0) {
								return;
							}
							const body = new DOMParser().parseFromString(html, "text/html").body;
							if (body.querySelector("img") === null || body.textContent.trim() !== "") {
								return;
							}
							e.preventDefault();
							Promise.all(files.map((file) => new Promise((resolve, reject) => {
								const reader = new FileReader();
								reader.onload = () => resolve(reader.result);
								reader.onerror = () => reject(reader.error);
								reader.readAsDataURL(file);
							}))).then((urls) => {
								urls.forEach((url) => editor.insertContent('<img src="' + url + '">'));
								editor.uploadImages();
							}).catch(() => {
								// The default paste is already cancelled, so say why nothing arrived. The clipboard's remote <img> is not inserted: it is the broken preview this option exists to avoid.
								editor.notificationManager.open({ text: "The image could not be read. Copy it again and paste.", type: "error", timeout: 6000 });
							});
						});
					}

					if (typeof setup === "function") {
						setup(editor);
					}
				},

				...(file_attachments ? {
					images_upload_handler: (blobInfo, progress) =>
						new Promise((success, failure) => {
							const blob = blobInfo.blob();
							if (!blob) {
								failure({ message: "Image upload failed.", remove: true });
								return;
							}
							if (file_attachments_accepted_types.length > 0 && !file_attachments_accepted_types.includes(blob.type)) {
								failure({ message: "This image type cannot be pasted.", remove: true });
								return;
							}
							if (file_attachments_max_size !== null && blob.size > file_attachments_max_size * 1024) {
								failure({ message: "This image is too large to paste.", remove: true });
								return;
							}

							const pathJoin = (path1, path2) => path1 ? path1.replace(/\/$/, "") + "/" + path2.replace(/^\//, "") : path2;
							const fail = () => failure({ message: "Image upload failed.", remove: true });

							// Filament 5: upload into componentFileAttachments, then ask the schema component to save the file and return its URL.
							$wire.upload(
								`componentFileAttachments.${statePath}`,
								blob,
								() => {
									$wire.callSchemaComponentMethod(component_key, "saveUploadedFileAttachmentAndGetUrl", {})
										.then((url) => (url ? success(pathJoin(images_upload_base_path, url)) : fail()))
										.catch(fail);
								},
								fail,
								(e) => progress(e.detail.progress),
							);
						}),
				} : {}),

				init_instance_callback: function (editor) {
					var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

					var isEnabled = removeImagesEventCallback && typeof removeImagesEventCallback === 'function';

					if (!isEnabled) return;
				
					var observer = new MutationObserver(function (mutations, instance) {
						var addedImages = [];
				
						mutations.forEach(function (mutationRecord) {
							Array.from(mutationRecord.addedNodes).forEach(function (currentNode) {
								if (currentNode.nodeName === 'IMG' && currentNode.className !== "mce-clonedresizable") {
									if (addedImages.indexOf(currentNode.src) >= 0) return;
				
									addedImages.push(currentNode.getAttribute("src"));
									return;
								}
				
								var imgs = currentNode.getElementsByTagName('img');
								Array.from(imgs).forEach(function (img) {
									if (addedImages.indexOf(img.src) >= 0) return;
				
									addedImages.push(img.getAttribute("src"));
								});
							});
						});
				
						var removedImages = [];
				
						mutations.forEach(function (mutationRecord) {
							Array.from(mutationRecord.removedNodes).forEach(function (currentNode) {
								if (currentNode.nodeName === 'IMG' && currentNode.className !== "mce-clonedresizable") {
									if (removedImages.indexOf(currentNode.src) >= 0) return;
				
									removedImages.push(currentNode.getAttribute("src"));
									return;
								}

								if (currentNode.nodeType === 1) {
									var imgs = currentNode.getElementsByTagName('img');
									Array.from(imgs).forEach(function (img) {
										if (addedImages.indexOf(img.src) >= 0) return;
				
										addedImages.push(img.getAttribute("src"));
									});
								}
							});
						});
				
						removedImages.forEach(function (imageSrc) {
							if (addedImages.indexOf(imageSrc) >= 0) return;
							if (removeImagesEventCallback && typeof removeImagesEventCallback === 'function') {
								removeImagesEventCallback(imageSrc);
							}
						});
					});
				
					observer.observe(editor.getBody(), {
						childList: true,
						subtree: true
					});
				},					

				automatic_uploads: file_attachments,
			};

			tinymce.init(tinyConfig);
		},
		updateEditorContent(content) {
			this.editor().setContent(content);
		},
		putCursorToEnd() {
			this.editor().selection.select(this.editor().getBody(), true);
			this.editor().selection.collapse(false);
		},
		delete()	{
			if (editors[this.statePath]) {
				this.editor().destroy();
				delete	editors[this.statePath];
			}
		},
		// Alpine calls this when the element leaves the DOM.
		destroy() {
			if (this.themeHandler) {
				window.removeEventListener("theme-changed", this.themeHandler);
				this.themeHandler = null;
			}
		}
	};
}
