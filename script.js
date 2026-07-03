document.addEventListener('DOMContentLoaded', () => {
    // 5-Second Screen Splash Out
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        const mainApp = document.getElementById('main-app');
        if(intro) intro.style.opacity = '0';
        setTimeout(() => {
            if(intro) intro.remove();
            if(mainApp) mainApp.classList.remove('hidden-app');
        }, 600);
    }, 5000);

    const card = document.getElementById('live-card');
    const ratioButtons = document.querySelectorAll('.ratio-btn');
    const addTextBtn = document.getElementById('add-text-btn');
    const imageLoader = document.getElementById('image-loader');
    const shapeButtons = document.querySelectorAll('.shape-btn');
    const downloadBtn = document.getElementById('download-card-btn');
    const deleteBtn = document.getElementById('delete-element-btn');

    const bgTypeSelect = document.getElementById('bg-type-select');
    const solidBgCtrl = document.getElementById('solid-bg-ctrl');
    const gradientBgCtrl = document.getElementById('gradient-bg-ctrl');
    const cardSolidColor = document.getElementById('card-solid-color');
    const cardGrad1 = document.getElementById('card-grad-1');
    const cardGrad2 = document.getElementById('card-grad-2');
    const cardGradAngle = document.getElementById('card-grad-angle');

    const emptyMsg = document.querySelector('.empty-inspector-msg');
    const controlsContainer = document.getElementById('inspector-controls');
    const typographyGroup = document.getElementById('typography-group');
    const fillGroup = document.getElementById('fill-group');
    const layersContainer = document.getElementById('layers-container');

    const propFontSize = document.getElementById('prop-font-size');
    const propFontFamily = document.getElementById('prop-font-family');
    const propFontColor = document.getElementById('prop-font-color');
    const toggleBold = document.getElementById('toggle-bold');
    const toggleItalic = document.getElementById('toggle-italic');
    const toggleUnderline = document.getElementById('toggle-underline');
    const caseButtons = document.querySelectorAll('.btn-case');
    const propFillColor = document.getElementById('prop-fill-color');
    const propBorderStyle = document.getElementById('prop-border-style');

    // NEW ATTACHMENTS: Text Area Custom Background Inputs Hooks
    const textBgType = document.getElementById('text-bg-type');
    const textSolidBgBlock = document.getElementById('text-solid-bg-block');
    const textGradBgBlock = document.getElementById('text-grad-bg-block');
    const textBgSolidColor = document.getElementById('text-bg-solid-color');
    const textBgGrad1 = document.getElementById('text-bg-grad1');
    const textBgGrad2 = document.getElementById('text-bg-grad2');
    const textBgGradAngle = document.getElementById('text-bg-grad-angle');

    const bSizes = { t: document.getElementById('b-size-t'), r: document.getElementById('b-size-r'), b: document.getElementById('b-size-b'), l: document.getElementById('b-size-l') };
    const bColors = { t: document.getElementById('b-color-t'), r: document.getElementById('b-color-r'), b: document.getElementById('b-color-b'), l: document.getElementById('b-color-l') };
    const radii = { tl: document.getElementById('radius-tl'), tr: document.getElementById('radius-tr'), bl: document.getElementById('radius-bl'), br: document.getElementById('radius-br') };

    const cropModal = document.getElementById('crop-modal');
    const cropImageTarget = document.getElementById('crop-image-target');
    const cropCancelBtn = document.getElementById('crop-cancel-btn');
    const cropSaveBtn = document.getElementById('crop-save-btn');

    let activeElement = null;
    let elementCount = 0;
    let cropperInstance = null;

    // Canvas Background Renderer Engine
    ratioButtons.forEach(button => {
        button.addEventListener('click', () => {
            ratioButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            card.className = 'card';
            const ratio = button.getAttribute('data-ratio');
            if(ratio === '1/1') card.classList.add('ratio-1-1');
            if(ratio === '16/9') card.classList.add('ratio-16-9');
            if(ratio === '9/16') card.classList.add('ratio-9-16');
            if(ratio === '4/3') card.classList.add('ratio-4-3');
        });
    });

    function applyCardBackgroundRendering() {
        if (bgTypeSelect.value === 'solid') {
            solidBgCtrl.classList.remove('hidden');
            gradientBgCtrl.classList.add('hidden');
            card.style.background = cardSolidColor.value;
        } else {
            solidBgCtrl.classList.add('hidden');
            gradientBgCtrl.classList.remove('hidden');
            card.style.background = `linear-gradient(${cardGradAngle.value}deg, ${cardGrad1.value}, ${cardGrad2.value})`;
        }
    }
    bgTypeSelect.addEventListener('change', applyCardBackgroundRendering);
    cardSolidColor.addEventListener('input', applyCardBackgroundRendering);
    cardGrad1.addEventListener('input', applyCardBackgroundRendering);
    cardGrad2.addEventListener('input', applyCardBackgroundRendering);
    cardGradAngle.addEventListener('input', applyCardBackgroundRendering);

    // 8-Way Core Resizing & High-Precision Event Listeners Matrix
    function makeElementInteractable(element) {
        const directions = ['t', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br'];
        directions.forEach(dir => {
            const resizer = document.createElement('div');
            resizer.className = `invisible-resizer resizer-${dir}`;
            element.appendChild(resizer);
            
            const startResize = (clientX, clientY) => {
                if (element.classList.contains('layer-locked')) return;
                initResizeSequence(clientX, clientY, dir, element);
            };
            resizer.addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); startResize(e.clientX, e.clientY); });
            resizer.addEventListener('touchstart', (e) => { e.stopPropagation(); if (e.touches.length === 1) startResize(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
        });

        function initResizeSequence(startX, startY, direction, el) {
            selectElement(el);
            const startWidth = el.offsetWidth;
            const startHeight = el.offsetHeight;
            const startTop = el.offsetTop;
            const startLeft = el.offsetLeft;

            function processResize(moveX, moveY) {
                const deltaX = moveX - startX;
                const deltaY = moveY - startY;
                if (direction.includes('r')) el.style.width = Math.max(45, startWidth + deltaX) + 'px';
                if (direction.includes('b')) el.style.height = Math.max(45, startHeight + deltaY) + 'px';
                if (direction.includes('t')) { const nh = startHeight - deltaY; if (nh > 45) { el.style.height = nh + 'px'; el.style.top = (startTop + deltaY) + 'px'; } }
                if (direction.includes('l')) { const nw = startWidth - deltaX; if (nw > 45) { el.style.width = nw + 'px'; el.style.left = (startLeft + deltaX) + 'px'; } }
            }
            document.onmousemove = (e) => processResize(e.clientX, e.clientY);
            document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
            document.ontouchmove = (e) => { if (e.touches.length === 1) processResize(e.touches[0].clientX, e.touches[0].clientY); };
            document.ontouchend = () => { document.ontouchmove = null; document.ontouchend = null; };
        }

        // FIXED TYPING SYSTEM: डबल क्लिक गर्दा मात्र टाइप गर्न मिल्ने पूर्ण समाधान
        const txtNode = element.querySelector('.card-text');
        if (txtNode) {
            element.addEventListener('dblclick', (e) => {
                if (element.classList.contains('layer-locked')) return;
                txtNode.setAttribute('contenteditable', 'true');
                txtNode.classList.add('editing-active');
                txtNode.focus();
            });
            txtNode.addEventListener('blur', () => {
                txtNode.setAttribute('contenteditable', 'false');
                txtNode.classList.remove('editing-active');
                window.getSelection().removeAllRanges();
            });
        }

        function startDragSequence(clientX, clientY, targetNode) {
            if (element.classList.contains('layer-locked')) return;
            if (targetNode.classList.contains('invisible-resizer')) return;
            if (targetNode.classList.contains('editing-active')) return;

            selectElement(element);
            let pos3 = clientX; let pos4 = clientY;

            function processMovement(moveX, moveY) {
                let pos1 = pos3 - moveX; let pos2 = pos4 - moveY;
                pos3 = moveX; pos4 = moveY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            }
            document.onmousemove = (e) => { e.preventDefault(); processMovement(e.clientX, e.clientY); };
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            element.ontouchmove = (e) => { if(e.touches.length === 1) processMovement(e.touches[0].clientX, e.touches[0].clientY); };
            element.ontouchend = () => { element.ontouchmove = null; element.ontouchend = null; };
        }
        element.addEventListener('mousedown', (e) => startDragSequence(e.clientX, e.clientY, e.target));
        element.addEventListener('touchstart', (e) => { if(e.touches.length === 1) startDragSequence(e.touches[0].clientX, e.touches[0].clientY, e.target); }, { passive: true });
    }

    // Dynamic Element Selection Inspector Matrix Synchronization
    function selectElement(element) {
        activeElement = element;
        document.querySelectorAll('.draggable').forEach(el => el.classList.remove('selected-item'));
        element.classList.add('selected-item');

        emptyMsg.classList.add('hidden');
        controlsContainer.classList.remove('hidden');

        const isText = element.querySelector('.card-text') !== null;
        const isShape = element.querySelector('.card-shape') !== null;

        typographyGroup.classList.toggle('hidden', !isText);
        fillGroup.classList.toggle('hidden', !isShape);

        loadBordersAndRadii(element);
        updateLayersPanel();

        if (isText) {
            const txt = element.querySelector('.card-text');
            propFontSize.value = parseInt(window.getComputedStyle(txt).fontSize) || 24;
            propFontColor.value = rgbToHex(window.getComputedStyle(txt).color);
            toggleBold.classList.toggle('active', txt.style.fontWeight === 'bold');
            toggleItalic.classList.toggle('active', txt.style.fontStyle === 'italic');
            toggleUnderline.classList.toggle('active', txt.style.textDecoration === 'underline');
            
            caseButtons.forEach(btn => {
                btn.classList.toggle('active', txt.style.textTransform === btn.getAttribute('data-case'));
            });

            // Text Box Background Inspector Sync
            const bgVal = txt.style.background || window.getComputedStyle(txt).background;
            if (bgVal.includes('linear-gradient')) {
                textBgType.value = 'gradient';
            } else if (bgVal !== 'rgba(0, 0, 0, 0)' && bgVal !== 'transparent' && bgVal !== '') {
                textBgType.value = 'solid';
                textBgSolidColor.value = rgbToHex(window.getComputedStyle(txt).backgroundColor);
            } else {
                textBgType.value = 'transparent';
            }
            renderTextBoxBgPanelVisibility();
        }
        if (isShape) {
            propFillColor.value = rgbToHex(window.getComputedStyle(element.querySelector('.card-shape')).backgroundColor);
        }
    }

    function resetInspector() {
        activeElement = null;
        emptyMsg.classList.remove('hidden');
        controlsContainer.classList.add('hidden');
        document.querySelectorAll('.draggable').forEach(el => el.classList.remove('selected-item'));
        document.querySelectorAll('.card-text').forEach(t => { t.setAttribute('contenteditable', 'false'); t.classList.remove('editing-active'); });
        updateLayersPanel();
    }

    // TEXT BOX BACKGROUND RENDER ACTION MECHANICS
    function renderTextBoxBgPanelVisibility() {
        textSolidBgBlock.classList.toggle('hidden', textBgType.value !== 'solid');
        textGradBgBlock.classList.toggle('hidden', textBgType.value !== 'gradient');
    }

    function applyTextBoxBackground() {
        if (!activeElement) return;
        const txt = activeElement.querySelector('.card-text');
        if (!txt) return;

        if (textBgType.value === 'transparent') {
            txt.style.background = 'transparent';
        } else if (textBgType.value === 'solid') {
            txt.style.background = textBgSolidColor.value;
        } else if (textBgType.value === 'gradient') {
            txt.style.background = `linear-gradient(${textBgGradAngle.value}deg, ${textBgGrad1.value}, ${textBgGrad2.value})`;
        }
    }
    textBgType.addEventListener('change', () => { renderTextBoxBgPanelVisibility(); applyTextBoxBackground(); });
    textBgSolidColor.addEventListener('input', applyTextBoxBackground);
    textBgGrad1.addEventListener('input', applyTextBoxBackground);
    textBgGrad2.addEventListener('input', applyTextBoxBackground);
    textBgGradAngle.addEventListener('input', applyTextBoxBackground);

    // FIXED BORDER HANDLING: भित्री चाइल्ड (Image/Shape) मा पनि बोर्डर रंग र प्रकृतिको एप्लिकेसन
    function loadBordersAndRadii(el) {
        propBorderStyle.value = el.style.borderStyle || 'none';
        bSizes.t.value = parseInt(el.style.borderTopWidth) || 0;
        bSizes.r.value = parseInt(el.style.borderRightWidth) || 0;
        bSizes.b.value = parseInt(el.style.borderBottomWidth) || 0;
        bSizes.l.value = parseInt(el.style.borderLeftWidth) || 0;
        bColors.t.value = rgbToHex(el.style.borderTopColor);
        bColors.r.value = rgbToHex(el.style.borderRightColor);
        bColors.b.value = rgbToHex(el.style.borderBottomColor);
        bColors.l.value = rgbToHex(el.style.borderLeftColor);
        radii.tl.value = parseInt(el.style.borderTopLeftRadius) || 0;
        radii.tr.value = parseInt(el.style.borderTopRightRadius) || 0;
        radii.bl.value = parseInt(el.style.borderBottomLeftRadius) || 0;
        radii.br.value = parseInt(el.style.borderBottomRightRadius) || 0;
    }

    function applyBorderStyling() {
        if (!activeElement || activeElement.classList.contains('layer-locked')) return;
        
        const style = propBorderStyle.value;
        const topW = bSizes.t.value + "px"; const rightW = bSizes.r.value + "px"; const bottomW = bSizes.b.value + "px"; const leftW = bSizes.l.value + "px";
        const topC = bColors.t.value; const rightC = bColors.r.value; const bottomC = bColors.b.value; const leftC = bColors.l.value;
        const radTL = radii.tl.value + "px"; const radTR = radii.tr.value + "px"; const radBL = radii.bl.value + "px"; const radBR = radii.br.value + "px";

        // बाहिरी एंकर डिभमा बोर्डर इन्जेक्ट गर्ने
        activeElement.style.borderStyle = style;
        activeElement.style.borderTopWidth = topW; activeElement.style.borderRightWidth = rightW; activeElement.style.borderBottomWidth = bottomW; activeElement.style.borderLeftWidth = leftW;
        activeElement.style.borderTopColor = topC; activeElement.style.borderRightColor = rightC; activeElement.style.borderBottomColor = bottomC; activeElement.style.borderLeftColor = leftC;
        activeElement.style.borderTopLeftRadius = radTL; activeElement.style.borderTopRightRadius = radTR; activeElement.style.borderBottomLeftRadius = radBL; activeElement.style.borderBottomRightRadius = radBR;

        // FIXED FIXTURE: भित्री इमेज/सेप/टेक्स्टमा पनि बोर्डर र्याप सञ्चालन गर्ने
        const innerChild = activeElement.querySelector('.card-img') || activeElement.querySelector('.card-shape') || activeElement.querySelector('.card-text');
        if (innerChild) {
            innerChild.style.borderStyle = style;
            innerChild.style.borderTopWidth = topW; innerChild.style.borderRightWidth = rightW; innerChild.style.borderBottomWidth = bottomW; innerChild.style.borderLeftWidth = leftW;
            innerChild.style.borderTopColor = topC; innerChild.style.borderRightColor = rightC; innerChild.style.borderBottomColor = bottomC; innerChild.style.borderLeftColor = leftC;
            innerChild.style.borderTopLeftRadius = radTL; innerChild.style.borderTopRightRadius = radTR; innerChild.style.borderBottomLeftRadius = radBL; innerChild.style.borderBottomRightRadius = radBR;
        }
    }

    [propBorderStyle, ...Object.values(bSizes), ...Object.values(bColors), ...Object.values(radii)].forEach(ctrl => {
        ctrl.addEventListener('input', applyBorderStyling);
    });

    // Typography Transforms Controls Matrix
    caseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if(!activeElement) return;
            const txt = activeElement.querySelector('.card-text');
            if(!txt) return;
            const targetCase = btn.getAttribute('data-case');
            caseButtons.forEach(b => b.classList.remove('active'));
            if(targetCase === 'sentence') {
                txt.style.textTransform = 'none';
                let rawText = txt.innerText.toLowerCase();
                txt.innerText = rawText.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
            } else if(targetCase === 'lower') { txt.style.textTransform = 'lowercase';
            } else if(targetCase === 'upper') { txt.style.textTransform = 'uppercase';
            } else if(targetCase === 'capitalize') { txt.style.textTransform = 'capitalize'; }
            btn.classList.add('active');
        });
    });

    propFontSize.addEventListener('input', () => { if(activeElement?.querySelector('.card-text')) activeElement.querySelector('.card-text').style.fontSize = propFontSize.value + 'px'; });
    propFontFamily.addEventListener('change', () => { if(activeElement?.querySelector('.card-text')) activeElement.querySelector('.card-text').style.fontFamily = propFontFamily.value; });
    propFontColor.addEventListener('input', () => { if(activeElement?.querySelector('.card-text')) activeElement.querySelector('.card-text').style.color = propFontColor.value; });
    toggleBold.addEventListener('click', () => { const t = activeElement.querySelector('.card-text'); t.style.fontWeight = t.style.fontWeight==='bold'?'normal':'bold'; toggleBold.classList.toggle('active'); });
    toggleItalic.addEventListener('click', () => { const t = activeElement.querySelector('.card-text'); t.style.fontStyle = t.style.fontStyle==='italic'?'normal':'italic'; toggleItalic.classList.toggle('active'); });
    toggleUnderline.addEventListener('click', () => { const t = activeElement.querySelector('.card-text'); t.style.textDecoration = t.style.textDecoration==='underline'?'none':'underline'; toggleUnderline.classList.toggle('active'); });
    propFillColor.addEventListener('input', () => { if(activeElement?.querySelector('.card-shape')) activeElement.querySelector('.card-shape').style.backgroundColor = propFillColor.value; });

    // Layers Track Board Managers Panels
    function updateLayersPanel() {
        layersContainer.innerHTML = '';
        const layers = Array.from(card.children);
        layers.forEach((el, idx) => el.style.zIndex = idx + 1);

        layers.reverse().forEach((el) => {
            const name = el.getAttribute('data-name');
            const iconClass = el.getAttribute('data-icon') || 'fa-shapes';
            const isHidden = el.classList.contains('layer-hidden');
            const isLocked = el.classList.contains('layer-locked');

            const item = document.createElement('div'); item.className = `layer-item ${activeElement === el ? 'active' : ''}`;
            const nameLbl = document.createElement('span'); nameLbl.className = 'layer-name'; nameLbl.innerHTML = `<i class="${iconClass}"></i> ${name}`;
            nameLbl.addEventListener('click', () => selectElement(el));

            const actions = document.createElement('div'); actions.className = 'layer-actions';
            const hideBtn = document.createElement('button'); hideBtn.className = `layer-btn ${isHidden ? 'active-state' : ''}`; hideBtn.innerHTML = isHidden ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
            hideBtn.addEventListener('click', (e) => { e.stopPropagation(); el.classList.toggle('layer-hidden'); updateLayersPanel(); });

            const lockBtn = document.createElement('button'); lockBtn.className = `layer-btn ${isLocked ? 'active-state' : ''}`; lockBtn.innerHTML = isLocked ? '<i class="fa-solid fa-lock"></i>' : '<i class="fa-solid fa-lock-open"></i>';
            lockBtn.addEventListener('click', (e) => { e.stopPropagation(); el.classList.toggle('layer-locked'); updateLayersPanel(); });

            const upBtn = document.createElement('button'); upBtn.className = 'layer-btn'; upBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
            upBtn.addEventListener('click', (e) => { e.stopPropagation(); if(el.nextElementSibling) { card.insertBefore(el.nextElementSibling, el); updateLayersPanel(); } });

            const downBtn = document.createElement('button'); downBtn.className = 'layer-btn'; downBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
            downBtn.addEventListener('click', (e) => { e.stopPropagation(); if(el.previousElementSibling) { card.insertBefore(el, el.previousElementSibling); updateLayersPanel(); } });

            actions.appendChild(hideBtn); actions.appendChild(lockBtn); actions.appendChild(upBtn); actions.appendChild(downBtn);
            item.appendChild(nameLbl); item.appendChild(actions); layersContainer.appendChild(item);
        });
    }

    // Asset Creation Pipeline Injection Units
    addTextBtn.addEventListener('click', () => {
        elementCount++; const el = document.createElement('div'); el.className = 'draggable';
        el.setAttribute('data-id', elementCount); el.setAttribute('data-name', `Text ${elementCount}`); el.setAttribute('data-icon', 'fa-solid fa-font');
        el.style.cssText = 'width:190px; height:80px; top:40px; left:40px;';
        el.innerHTML = `<div class="text-drag-wrapper"><div class="card-text" contenteditable="false" style="color: #000000; background: transparent;">Double click to edit text</div></div>`;
        card.appendChild(el); makeElementInteractable(el); selectElement(el);
        el.querySelector('.card-text').addEventListener('input', (e) => {
            let val = e.target.innerText.trim().substring(0, 12);
            el.setAttribute('data-name', val ? `"${val}..."` : `Text ${el.getAttribute('data-id')}`); updateLayersPanel();
        });
    });

    imageLoader.addEventListener('change', (e) => {
        const file = e.target.files[0]; if(!file) return;
        const reader = new FileReader();
        reader.onload = (event) => { cropImageTarget.src = event.target.result; cropModal.classList.remove('hidden'); if(cropperInstance) cropperInstance.destroy(); cropperInstance = new Cropper(cropImageTarget, { viewMode: 1, movable: true, zoomable: true }); };
        reader.readAsDataURL(file);
    });
    cropCancelBtn.addEventListener('click', () => { cropModal.classList.add('hidden'); imageLoader.value = ''; });
    cropSaveBtn.addEventListener('click', () => {
        if(!cropperInstance) return; const croppedUrl = cropperInstance.getCroppedCanvas().toDataURL(); elementCount++;
        const el = document.createElement('div'); el.className = 'draggable'; el.setAttribute('data-id', elementCount); el.setAttribute('data-name', `Image ${elementCount}`); el.setAttribute('data-icon', 'fa-solid fa-image');
        el.style.cssText = 'width:140px; height:140px; top:50px; left:50px;'; el.innerHTML = `<img src="${croppedUrl}" class="card-img">`;
        card.appendChild(el); makeElementInteractable(el); selectElement(el); cropModal.classList.add('hidden'); imageLoader.value = '';
    });

    shapeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.getAttribute('data-shape'); const faIcon = btn.querySelector('i').className; elementCount++;
            const el = document.createElement('div'); el.className = 'draggable'; el.setAttribute('data-id', elementCount); el.setAttribute('data-name', `${shape.toUpperCase()} ${elementCount}`); el.setAttribute('data-icon', faIcon);
            el.style.cssText = 'width:100px; height:100px; top:60px; left:60px;'; el.innerHTML = `<div class="card-shape shape-${shape}" data-shape-type="${shape}"></div>`;
            card.appendChild(el); makeElementInteractable(el); selectElement(el);
        });
    });

    deleteBtn.addEventListener('click', () => { if(activeElement) { activeElement.remove(); resetInspector(); } });

    // FIXED DOWNLOAD SYSTEM: html2canvas को क्लिप पाथ बग स्थायी रूपमा समाधान गर्न SVG यूआरएल मास्क इन्जेक्सन
    downloadBtn.addEventListener('click', () => {
        document.querySelectorAll('.draggable').forEach(el => el.classList.remove('selected-item'));
        card.classList.add('hide-overflow-export');

        const geometricShapes = card.querySelectorAll('.card-shape');
        geometricShapes.forEach(shape => {
            const type = shape.getAttribute('data-shape-type');
            if(['circle','triangle','pentagon','hexagon','octagon','diamond','star','ribbon'].includes(type)) {
                shape.classList.add(`svg-fix-${type}`);
            }
        });

        setTimeout(() => {
            html2canvas(card, {
                useCORS: true,
                scale: 2,
                backgroundColor: null,
                logging: false
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `BijayStudioCard-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                card.classList.remove('hide-overflow-export');
                geometricShapes.forEach(shape => {
                    const type = shape.getAttribute('data-shape-type');
                    if(type) shape.classList.remove(`svg-fix-${type}`);
                });
                if(activeElement) activeElement.classList.add('selected-item');
            });
        }, 150);
    });

    document.addEventListener('mousedown', (e) => {
        if(!card.contains(e.target) && !document.getElementById('inspector').contains(e.target) && !document.getElementById('layers-container').contains(e.target) && !e.target.closest('.shape-btn') && !e.target.classList.contains('ratio-btn') && e.target.id !== "add-text-btn" && !e.target.closest('.case-grid') && !e.target.closest('#typography-group')) {
            resetInspector();
        }
    });

    function rgbToHex(rgb) {
        if(!rgb || rgb.startsWith('#')) return rgb || '#000000';
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return match ? "#" + ((1 << 24) + (+match[1] << 16) + (+match[2] << 8) + +match[3]).toString(16).slice(1) : '#000000';
    }
});