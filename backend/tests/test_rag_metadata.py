"""Tests for RAG metadata extraction."""

from __future__ import annotations

from app.rag.metadata import MetadataExtractor


class TestMetadataExtractor:
    """Tests for metadata extraction from paths and content."""

    def test_extract_from_government_path(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/government/pm_kisan.md", "PM-KISAN scheme")
        assert meta["category"] == "government_scheme"
        assert "Pm Kisan" in meta["title"]

    def test_extract_from_crops_path(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/crops/rice.md", "Rice cultivation")
        assert meta["category"] == "crop"
        assert meta["crop"] == "rice"

    def test_extract_from_weather_path(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/weather/guide.md", "Weather guide")
        assert meta["category"] == "weather"

    def test_extract_crop_from_content(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/general/doc.md", "Cotton farming guide")
        assert meta["crop"] == "cotton"

    def test_extract_state_from_content(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/doc.md", "Farming in Punjab and Haryana")
        assert meta["state"] == "Punjab"

    def test_extract_year_from_content(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/doc.md", "Updated in 2024 for new policies")
        assert meta["year"] == "2024"

    def test_tags_include_category(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/diseases/blast.md", "Rice blast disease")
        assert "disease" in meta["tags"]
        assert "rice" in meta["tags"]

    def test_tags_include_keywords(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/doc.md", "Organic fertilizer and irrigation guide")
        assert "organic" in meta["tags"]
        assert "fertilizer" in meta["tags"]
        assert "irrigation" in meta["tags"]

    def test_unknown_category(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/misc/doc.md", "Some content")
        assert meta["category"] == "general"

    def test_extra_metadata_merged(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/doc.md", "content", extra={"custom": "value"})
        assert meta["custom"] == "value"

    def test_language_defaults_to_en(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/doc.md", "content")
        assert meta["language"] == "en"

    def test_district_empty_by_default(self):
        ext = MetadataExtractor()
        meta = ext.extract("/data/doc.md", "content")
        assert meta["district"] == ""
