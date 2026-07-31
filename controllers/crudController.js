const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const GenericModel = require('../models/GenericModel');
const modules = require('../config/modules');

/**
 * Factory that generates full CRUD handlers (index/create/store/edit/update/destroy)
 * for a module defined in config/modules.js. This avoids writing ~15 near-identical
 * controllers by hand.
 */
function crudController(moduleKey) {
  const cfg = modules[moduleKey];
  if (!cfg) throw new Error(`Module "${moduleKey}" is not registered in config/modules.js`);
  const model = new GenericModel(cfg.table);

  function removeOldFile(filename) {
    if (!filename) return;
    const p = path.join(__dirname, '..', 'public', 'uploads', filename);
    fs.unlink(p, () => {});
  }

  return {
    cfg,

    async index(req, res) {
      const items = await model.all();
      res.render('admin/crud/index', { title: cfg.label, moduleKey, cfg, items });
    },

    create(req, res) {
      res.render('admin/crud/form', { title: `Tambah ${cfg.label}`, moduleKey, cfg, item: {}, mode: 'create' });
    },

    async store(req, res) {
      try {
        const data = { ...req.body };
        cfg.fields.forEach(f => {
          if (f.type === 'file') delete data[f.name];
        });

        if (req.file && cfg.uploadField) {
          data[cfg.uploadField] = req.file.filename;
        }

        if (cfg.hasSlug) {
          data.slug = slugify(data[cfg.slugSource] || '', { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);
          data.user_id = req.session.user.id;
        }

        await model.create(data);
        req.flash('success', `${cfg.label} berhasil ditambahkan.`);
        res.redirect(`/admin/${moduleKey}`);
      } catch (err) {
        console.error(err);
        req.flash('error', 'Gagal menyimpan data: ' + err.message);
        res.redirect(`/admin/${moduleKey}/create`);
      }
    },

    async edit(req, res) {
      const item = await model.find(req.params.id);
      if (!item) {
        req.flash('error', 'Data tidak ditemukan.');
        return res.redirect(`/admin/${moduleKey}`);
      }
      res.render('admin/crud/form', { title: `Edit ${cfg.label}`, moduleKey, cfg, item, mode: 'edit' });
    },

    async update(req, res) {
      try {
        const id = req.params.id;
        const existing = await model.find(id);
        const data = { ...req.body };
        cfg.fields.forEach(f => {
          if (f.type === 'file') delete data[f.name];
        });

        if (req.file && cfg.uploadField) {
          data[cfg.uploadField] = req.file.filename;
          if (existing) removeOldFile(existing[cfg.uploadField]);
        }

        if (cfg.hasSlug && data[cfg.slugSource]) {
          data.slug = slugify(data[cfg.slugSource], { lower: true, strict: true }) + '-' + id;
        }

        await model.update(id, data);
        req.flash('success', `${cfg.label} berhasil diperbarui.`);
        res.redirect(`/admin/${moduleKey}`);
      } catch (err) {
        console.error(err);
        req.flash('error', 'Gagal memperbarui data: ' + err.message);
        res.redirect(`/admin/${moduleKey}/${req.params.id}/edit`);
      }
    },

    async destroy(req, res) {
      try {
        const id = req.params.id;
        const existing = await model.find(id);
        if (existing && cfg.uploadField && existing[cfg.uploadField]) {
          removeOldFile(existing[cfg.uploadField]);
        }
        await model.delete(id);
        req.flash('success', `${cfg.label} berhasil dihapus.`);
      } catch (err) {
        console.error(err);
        req.flash('error', 'Gagal menghapus data.');
      }
      res.redirect(`/admin/${moduleKey}`);
    }
  };
}

module.exports = crudController;
