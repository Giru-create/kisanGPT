"""Tests for the memory extractor."""

from __future__ import annotations

from app.memory.extractor import extract_from_message


class TestExtractCrops:
    """Tests for crop extraction."""

    def test_extracts_crop_from_grows(self) -> None:
        items = extract_from_message("I grow wheat in my farm")
        crops = [i for i in items if i.category == "crop"]
        assert len(crops) >= 1
        assert any(i.value == "wheat" for i in crops)

    def test_extracts_crop_from_planting(self) -> None:
        items = extract_from_message("I am planting rice this season")
        crops = [i for i in items if i.category == "crop"]
        assert len(crops) >= 1
        assert any(i.value == "rice" for i in crops)

    def test_extracts_multiple_crops(self) -> None:
        items = extract_from_message("I grow wheat and rice on my farm")
        crops = [i for i in items if i.category == "crop"]
        values = {i.value for i in crops}
        assert "wheat" in values
        assert "rice" in values

    def test_no_crop_in_generic_message(self) -> None:
        items = extract_from_message("What is the weather today?")
        crops = [i for i in items if i.category == "crop"]
        assert len(crops) == 0


class TestExtractLocations:
    """Tests for location extraction."""

    def test_extracts_location_from_in(self) -> None:
        items = extract_from_message("My farm is in Agra")
        locs = [i for i in items if i.category == "location"]
        assert len(locs) >= 1
        assert any("Agra" in i.value for i in locs)

    def test_extracts_location_from_near(self) -> None:
        items = extract_from_message("I live near Punjab")
        locs = [i for i in items if i.category == "location"]
        assert len(locs) >= 1


class TestExtractPreferences:
    """Tests for preference extraction."""

    def test_extracts_preference(self) -> None:
        items = extract_from_message("I prefer organic farming methods")
        prefs = [i for i in items if i.category == "preference"]
        assert len(prefs) >= 1

    def test_extracts_language(self) -> None:
        items = extract_from_message("I speak Hindi")
        prefs = [i for i in items if i.category == "preference"]
        lang_prefs = [i for i in prefs if "language" in i.key]
        assert len(lang_prefs) >= 1


class TestExtractSoil:
    """Tests for soil extraction."""

    def test_extracts_soil_type(self) -> None:
        items = extract_from_message("My soil type is loamy")
        soil = [i for i in items if i.key == "soil_type"]
        assert len(soil) >= 1
        assert soil[0].value == "loamy"

    def test_extracts_soil_name(self) -> None:
        items = extract_from_message("I have clay soil")
        soil = [i for i in items if i.key == "soil_type"]
        assert len(soil) >= 1


class TestExtractEdgeCases:
    """Tests for edge cases."""

    def test_empty_message(self) -> None:
        items = extract_from_message("")
        assert items == []

    def test_no_useful_info(self) -> None:
        items = extract_from_message("Hello, how are you?")
        assert items == []

    def test_mixed_information(self) -> None:
        items = extract_from_message("I grow wheat in Agra and my soil is loamy")
        categories = {i.category for i in items}
        assert "crop" in categories
        assert "location" in categories
